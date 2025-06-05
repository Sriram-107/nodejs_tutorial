const { log } = require('console');
const express = require('express');
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list")
const verifyRoles = require("../../middleware/verifyRoles");

const { getEmployeeDetails, postEmployeeDetail, deleteEmployeeDetail, updateEmployeeDetail, getEmployee } = require('../../controllers/employeesController').default;

router.route('/').get(getEmployeeDetails).post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    postEmployeeDetail).put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployeeDetail).delete(
            verifyRoles(ROLES_LIST.Admin), deleteEmployeeDetail)

router.route('/:id').get(getEmployee)

module.exports = router;