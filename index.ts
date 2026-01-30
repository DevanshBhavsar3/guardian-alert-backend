import express from "express";
import twilio from "twilio";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = twilio(accountSid, authToken);

const app = express();

app.use(
  cors({
    origin: "https://guardian-alert-two.vercel.app",
  }),
);
app.use(express.json());

app.post("/call", async (req, res) => {
  const body = req.body;

  try {
    const callRes = await client.calls.create({
      to: body.phoneNo,
      from: "+16403568498",
      twiml: `<Response><Say>There is an accident at ${body.location}. Please reach there quickly.</Say></Response>`,
    });

    if (
      callRes.status == "no-answer" ||
      callRes.status == "busy" ||
      callRes.status == "failed"
    ) {
      return res.json({
        sucess: false,
      });
    }

    return res.json({
      success: true,
    });
  } catch (e) {
    console.error(e);
  }
});

app.listen(3001);
