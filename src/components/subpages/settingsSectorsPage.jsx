import {RolesBallons, UserBallons} from '../settingsBallons.jsx'
import {useEffect, useState} from "react";
import MainRequests from "../../services/requests.js";
import {Plus, ScanBarcode} from "lucide-react";
import Inputs from "../inputs.jsx";
import { useForm,useFieldArray, Controller } from "react-hook-form"
import Header2 from "../header2.jsx";
import {FormateDate} from "../../services/formateDateService.js";
import Select from "../select.jsx";

const request = new MainRequests()

export default function SectorsPage() {
    return (
        <div>Dboa</div>
    )
}