const express = require("express");
const stripe = require("stripe")("sk_test_51Qmu74G7hLxsSjVp8iOqcP9WpAKNqlDJNFODRYuU1hZmow8eH6vghde2HmcEziwV1VDjkx2OjWZm5qr1jjg0l1OW00bpsgNDWj");
const CoursePurchase = require("../models/coursePurchaseModel");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

const router = express.Router();

// Route to create a Stripe checkout session

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseName,
              images: [course.coursePic.url], 
            },
            unit_amount: course.coursePrice * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`, 
      cancel_url: `http://localhost:5173/course-detail/${courseId}`, 
      metadata: { courseId, userId },
    });

  
    newPurchase.paymentId = session.id;
    await newPurchase.save();
    

    return res.status(200).json({ success: true, url: session.url, id: session.id });
  } catch (error) {
    console.error("Error in creating checkout session:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = "whsec_69566440e056eb86523a332f3663f727049470c608e4dcc1bcf1926467bdfe7a";
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed event received");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate("courseId");

      if (!purchase) {
        console.error("Purchase not found for session ID:", session.id);
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      purchase.status = "completed";
      await purchase.save();
      console.log("Purchase status updated:", purchase);
    } catch (err) {
      console.error("Error updating purchase:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.status(200).send();
});


// Route to check if a user has purchased a course
router.post("/check-purchase-status", async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const purchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed",
    });

    if (purchase) {
      return res.status(200).json({ success: true, purchased: true });
    } else {
      return res.status(200).json({ success: true, purchased: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



//total revuenue of instructor
router.get("/total-revenue/:instructorId", async (req, res) => {
  try {
    const { instructorId } = req.params;

    const courses = await Course.find({ creator: instructorId }).select("_id");
    const courseIds = courses.map((course) => course._id);
    const purchases = await CoursePurchase.aggregate([
      {
        $match: {
          courseId: { $in: courseIds },
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = purchases.length > 0 ? purchases[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.get('/instructor-courses/:instructorId', async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ success: false, message: 'Invalid instructor ID' });
    }

    const courses = await Course.find({ creator: instructorId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this instructor' });
    }

    const coursesWithRevenue = await Promise.all(
      courses.map(async (course) => {
        try {
          const purchases = await CoursePurchase.aggregate([
            {
              $match: {
                courseId: new mongoose.Types.ObjectId(course._id),
                status: 'completed',
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
              },
            },
          ]);

          const totalRevenue = purchases.length > 0 ? purchases[0].totalRevenue : 0;

          return {
            ...course.toObject(),
            totalRevenue,
          };
        } catch (err) {
          console.error('Error processing course:', course._id, err.message);
          return { ...course.toObject(), totalRevenue: 0 };
        }
      })
    );

    return res.status(200).json({
      success: true,
      courses: coursesWithRevenue,
    });
  } catch (error) {
    console.error('Error fetching instructor courses:', error.message, error.stack);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});


module.exports = router;
