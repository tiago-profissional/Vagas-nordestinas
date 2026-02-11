fetch("http://localhost:3002/jobs", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Frontend React",
    company: "Empresa Nova",
    city: "Recife",
    state: "PE",
    work_mode: "remote",
    employment_type: "full_time",
    seniority: "junior",
    salary_min: 5000,
    salary_max: 7000,
    currency: "BRL",
    description: "Vaga para dev React"
  })
})
  .then((res) => res.json())
  .then((data) => console.log("CRIADO:", data))
  .catch((err) => console.log("ERROR:", err));
