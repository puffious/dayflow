const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// POST Request Leave
router.post("/request", async (req, res) => {
  const { employee_id, leave_type, start_date, end_date, reason } = req.body;

  const { data, error } = await supabase
    .from("leaves")
    .insert([{ employee_id, leave_type, start_date, end_date, reason }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Leave requested successfully" });
});

// GET All Pending Leaves (For Admin Dashboard)
router.get("/pending", async (req, res) => {
  // Join with employees table to get names
  const { data, error } = await supabase
    .from("leaves")
    .select("*, employees(first_name, last_name)")
    .eq("status", "Pending");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT Approve/Reject Leave
router.put("/status/:id", async (req, res) => {
  const { status } = req.body; // 'Approved' or 'Rejected'

  const { data, error } = await supabase
    .from("leaves")
    .update({ status })
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: `Leave ${status}` });
});

module.exports = router;
