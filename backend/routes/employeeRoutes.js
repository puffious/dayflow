const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// GET all employees with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("employees")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET current employee by email
router.get("/profile/me", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "email query param is required" });

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return res.status(404).json({ error: "Employee not found" });
    res.json(data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create a new employee (used after Supabase signup)
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      email,
      first_name,
      last_name,
      position,
      department,
      salary,
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const { data, error } = await supabase.from("employees").insert([
      {
        user_id: user_id || null,
        email,
        first_name: first_name || "",
        last_name: last_name || "",
        position: position || "",
        department: department || "",
        salary: salary || null,
      },
    ]).select().single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Employee created successfully", data });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single employee by ID
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) return res.status(404).json({ error: "Employee not found" });
    res.json(data);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update employee
router.put("/:id", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      position,
      department,
      salary,
      status,
    } = req.body;

    const { data, error } = await supabase
      .from("employees")
      .update({
        first_name: first_name || undefined,
        last_name: last_name || undefined,
        position: position || undefined,
        department: department || undefined,
        salary: salary || undefined,
        status: status || undefined,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Employee updated successfully", data });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE employee (soft delete - set status to inactive)
router.delete("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .update({ status: "INACTIVE" })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Employee deleted successfully", data });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
