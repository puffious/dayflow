const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// POST Check In
router.post("/check-in", async (req, res) => {
  const { employee_id } = req.body;
  const now = new Date();
  const timeString = now.toTimeString().split(" ")[0]; // HH:MM:SS

  const { data, error } = await supabase.from("attendance").insert([
    {
      employee_id,
      date: new Date(),
      check_in: timeString,
      status: "Present",
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Checked in successfully" });
});

// PUT Check Out
router.put("/check-out/:attendanceId", async (req, res) => {
  const now = new Date();
  const timeString = now.toTimeString().split(" ")[0];

  const { data, error } = await supabase
    .from("attendance")
    .update({ check_out: timeString })
    .eq("id", req.params.attendanceId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Checked out successfully" });
});

// GET Attendance for an Employee
router.get("/:employee_id", async (req, res) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", req.params.employee_id)
    .order("date", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
