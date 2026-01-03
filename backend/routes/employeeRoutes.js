const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// GET all employees
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("employees").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST create a new employee (and Auth user)
router.post("/register", async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    position,
    department,
    salary,
  } = req.body;

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) return res.status(400).json({ error: authError.message });

  // 2. Create profile in Employees table
  const { data, error } = await supabase.from("employees").insert([
    {
      user_id: authData.user.id, // Link to auth user
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
