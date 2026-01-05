const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// POST check-in
router.post("/check-in", async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "employee_id is required" });
    }

    const today = new Date().toISOString().split("T")[0];

    // Check if already checked in today
    const { data: existing, error: checkError } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", employee_id)
      .eq("date", today)
      .single();

    if (existing && !checkError) {
      return res.status(400).json({ error: "Already checked in today" });
    }

    const { data, error } = await supabase
      .from("attendance")
      .insert([
        {
          employee_id,
          date: today,
          check_in_time: new Date().toISOString(),
          status: "present",
        },
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      message: "Checked in successfully",
      data,
    });
  } catch (error) {
    console.error("Error checking in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT check-out
router.put("/check-out/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: attendance, error: fetchError } = await supabase
      .from("attendance")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    if (attendance.check_out_time) {
      return res.status(400).json({ error: "Already checked out" });
    }

    const checkOutTime = new Date().toISOString();
    const checkInTime = new Date(attendance.check_in_time);
    const diffMs = new Date(checkOutTime) - checkInTime;
    const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

    const { data, error } = await supabase
      .from("attendance")
      .update({
        check_out_time: checkOutTime,
        total_hours: parseFloat(diffHours),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Checked out successfully",
      data,
    });
  } catch (error) {
    console.error("Error checking out:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET attendance history for employee
router.get("/history/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { from_date, to_date } = req.query;

    let query = supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", employee_id)
      .order("date", { ascending: false });

    if (from_date) {
      query = query.gte("date", from_date);
    }

    if (to_date) {
      query = query.lte("date", to_date);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET attendance report (admin)
router.get("/report", async (req, res) => {
  try {
    const { department, from_date, to_date, limit = 100, offset = 0 } = req.query;

    let query = supabase
      .from("attendance")
      .select(
        "*, employees(id, first_name, last_name, email, department)",
        { count: "exact" }
      )
      .order("date", { ascending: false });

    if (department) {
      query = query.eq("employees.department", department);
    }

    if (from_date) {
      query = query.gte("date", from_date);
    }

    if (to_date) {
      query = query.lte("date", to_date);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) return res.status(400).json({ error: error.message });

    // Calculate summary stats
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalHours = 0;

    data.forEach((record) => {
      if (record.status === "present") totalPresent++;
      else totalAbsent++;
      if (record.total_hours) totalHours += record.total_hours;
    });

    res.json({
      report: data,
      summary: {
        totalPresent,
        totalAbsent,
        totalHours: totalHours.toFixed(2),
      },
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET daily summary
router.get("/daily/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const { data, error } = await supabase
      .from("attendance")
      .select("*, employees(id, first_name, last_name, email)")
      .eq("date", date);

    if (error) return res.status(400).json({ error: error.message });

    let present = 0;
    let absent = 0;
    let late = 0;

    data.forEach((record) => {
      if (record.status === "present") {
        present++;
        // Consider late if check-in is after 10 AM
        const checkInHour = new Date(record.check_in_time).getHours();
        if (checkInHour > 10) late++;
      } else {
        absent++;
      }
    });

    res.json({
      date,
      summary: {
        present,
        absent,
        late,
        total: data.length,
      },
      records: data,
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET Attendance for an Employee (backward compatibility)
router.get("/:employee_id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", req.params.employee_id)
      .order("date", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
