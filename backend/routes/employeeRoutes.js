const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// GET all employees
router.get("/", async (_req, res) => {
  const { data, error } = await supabase.from("employees").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET current employee by email
router.get("/me", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "email query param is required" });

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return res.status(404).json({ error: "Employee not found" });
  res.json(data);
});

// POST create a new employee (used after Supabase signup)
router.post("/", async (req, res) => {
  const {
    user_id,
    email,
    first_name,
    last_name,
    position,
    department,
    salary,
  } = req.body;

  if (!user_id || !email) {
    return res.status(400).json({ error: "user_id and email are required" });
  }

  const { data, error } = await supabase.from("employees").insert([
    {
      user_id,
      email,
      first_name,
      last_name,
      position,
      department,
      salary,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: "Employee created successfully", data });
});

// GET single employee by ID
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", req.params.id)
    .single();
  if (error) return res.status(404).json({ error: "Employee not found" });
  res.json(data);
});

module.exports = router;
