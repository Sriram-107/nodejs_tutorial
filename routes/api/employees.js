const { log } = require('console');
const express = require('express');
const router = express.Router();

const { getEmployeeDetails, postEmployeeDetail, deleteEmployeeDetail, updateEmployeeDetail, getEmployee } = require('../../controllers/employeesController').default;

router.route('/').get(getEmployeeDetails).post(postEmployeeDetail).put(updateEmployeeDetail).delete(deleteEmployeeDetail)

router.route('/:id').get(getEmployee)

module.exports = router;