const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// POST Signup - Create user in Supabase Auth
router.post("/signup", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create employee record
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .insert([
        {
          user_id: authData.user.id,
          email,
          first_name: first_name || "",
          last_name: last_name || "",
        },
      ])
      .select()
      .single();

    if (employeeError) {
      return res.status(400).json({ error: employeeError.message });
    }

    res.status(201).json({
      message: "User created successfully",
      user: authData.user,
      employee: employeeData,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST Login - Sign in with email and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Get employee details
    const { data: employeeData } = await supabase
      .from("employees")
      .select("*")
      .eq("email", email)
      .single();

    res.json({
      message: "Login successful",
      user: data.user,
      session: data.session,
      employee: employeeData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST Logout
router.post("/logout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET Current user profile
router.get("/me", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
