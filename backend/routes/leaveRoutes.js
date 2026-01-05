const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// Calculate days between dates
function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

// POST Request Leave
router.post("/request", async (req, res) => {
  try {
    const { employee_id, leave_type, start_date, end_date, reason } = req.body;

    if (!employee_id || !leave_type || !start_date || !end_date) {
      return res.status(400).json({
        error: "employee_id, leave_type, start_date, and end_date are required",
      });
    }

    const days = calculateDays(start_date, end_date);

    const { data, error } = await supabase
      .from("leaves")
      .insert([
        {
          employee_id,
          leave_type,
          start_date,
          end_date,
          reason: reason || "",
          status: "PENDING",
          days_requested: days,
        },
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      message: "Leave requested successfully",
      data,
    });
  } catch (error) {
    console.error("Error requesting leave:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET user's own leaves
router.get("/my-leaves/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { status, leave_type } = req.query;

    let query = supabase
      .from("leaves")
      .select("*")
      .eq("employee_id", employee_id)
      .order("start_date", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (leave_type) {
      query = query.eq("leave_type", leave_type);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET All Pending Leaves (For Admin Dashboard)
router.get("/pending", async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from("leaves")
      .select("*, employees(id, first_name, last_name, email, department)", {
        count: "exact",
      })
      .eq("status", "PENDING")
      .order("start_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching pending leaves:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET leave balance for employee
router.get("/balance/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;

    // Define leave balances per year
    const leaveBalances = {
      SICK: 5,
      CASUAL: 10,
      VACATION: 15,
      OTHERS: 5,
    };

    const { data: approvedLeaves, error } = await supabase
      .from("leaves")
      .select("*")
      .eq("employee_id", employee_id)
      .eq("status", "APPROVED");

    if (error) return res.status(400).json({ error: error.message });

    // Calculate used days per type
    const usedDays = {
      SICK: 0,
      CASUAL: 0,
      VACATION: 0,
      OTHERS: 0,
    };

    approvedLeaves.forEach((leave) => {
      if (usedDays.hasOwnProperty(leave.leave_type)) {
        usedDays[leave.leave_type] += leave.days_requested || 0;
      }
    });

    // Calculate remaining
    const balance = {};
    Object.keys(leaveBalances).forEach((type) => {
      balance[type] = {
        total: leaveBalances[type],
        used: usedDays[type] || 0,
        remaining: leaveBalances[type] - (usedDays[type] || 0),
      };
    });

    res.json(balance);
  } catch (error) {
    console.error("Error calculating balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT Approve/Reject Leave
router.put("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        error: "status must be APPROVED or REJECTED",
      });
    }

    const { data, error } = await supabase
      .from("leaves")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: `Leave ${status}`,
      data,
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all leaves (admin report)
router.get("/report", async (req, res) => {
  try {
    const {
      department,
      status,
      from_date,
      to_date,
      limit = 100,
      offset = 0,
    } = req.query;

    let query = supabase
      .from("leaves")
      .select(
        "*, employees(id, first_name, last_name, email, department)",
        { count: "exact" }
      )
      .order("start_date", { ascending: false });

    if (department) {
      query = query.eq("employees.department", department);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (from_date) {
      query = query.gte("start_date", from_date);
    }

    if (to_date) {
      query = query.lte("end_date", to_date);
    }

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error generating leave report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
