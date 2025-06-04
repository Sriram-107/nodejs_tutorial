import employeeData from '../model/employees.json' with { type: 'json' };
const data = {
    employees: employeeData,
    setEmployees: function (data) { this.employees = data }
};

const getEmployeeDetails = (req, res) => {
    res.json(data.employees);
};

const postEmployeeDetail = (req, res) => {
    const newEmployee = {
        "id": parseInt(data.employees[data.employees.length - 1].id) + 1 || 1,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName
    }
    data.setEmployees([...data.employees, newEmployee]);
    if (!newEmployee.firstName || !newEmployee.lastName) {
        return res.status(404).json({ "message": "First and Last Name required" });
    }
    res.json(data.employees);
};

const updateEmployeeDetail = (req, res) => {
    const employee = data.employees.find((employee) => employee.id === req.body.id);
    if (!employee) {
        return res.status(404).json({ "message": "Employee Detail not found" })
    }
    if (req.body.firstName) {
        employee.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
        employee.lastName = req.body.lastName;
    }
    const filterEmployees = data.employees.filter((employee) => employee.id !== req.body.id);
    const unsortedArray = [...filterEmployees, employee];
    data.setEmployees(unsortedArray.sort((a, b) => a.id - b.id));
    res.json(data.employees)
};

const deleteEmployeeDetail = (req, res) => {
    console.log(req.body.id);
    const findEmployee = data.employees.find((employee) => employee.id = req.body.id);
    if (!findEmployee) {
        return res.status(400).json({ "message": "Employee detail not found" })
    }
    const filterEmployee = data.employees.filter((employee) => employee.id !== req.body.id)
    data.setEmployees(filterEmployee);
    // res.json({
    //     "id": `${findEmployee.id}`,
    //     "message": "Successfully Deleted"
    // })
    res.json(data.employees)
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(employee => employee.id === req.params.id);
    if (!employee) {
        res.status(400).json({ "message": "Employee Detail not found" });
    }
    res.json(employee);
};

export default { getEmployeeDetails, postEmployeeDetail, updateEmployeeDetail, deleteEmployeeDetail, getEmployee }