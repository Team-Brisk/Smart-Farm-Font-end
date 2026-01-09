import React, { useState, useEffect } from "react";
import { Switch, Card, message, Typography, Spin, Row, Col, Tag, TimePicker, Button, Space, Select, Slider, InputNumber } from "antd";
import {
  PoweroffOutlined, WifiOutlined, BulbOutlined, CloudOutlined, RobotOutlined, ClockCircleOutlined, StopOutlined
  , PlayCircleOutlined, SyncOutlined, ArrowsAltOutlined, MinusOutlined, PlusOutlined, VideoCameraOutlined,
  EyeInvisibleOutlined, AlertOutlined, RollbackOutlined, SafetyCertificateOutlined, // ✅ ไอคอนหัวข้อ
  ClearOutlined, // ✅ ไอคอนปุ่ม
  HomeOutlined, AimOutlined, ToolOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  SaveOutlined,
  CameraOutlined
} from "@ant-design/icons";

import io from 'socket.io-client';
import dayjs from "dayjs";
import { ThunderboltOutlined } from "@ant-design/icons";
import { Snowflake, Fan, Focus } from "lucide-react";
interface MqttPayload {
  topic: string;
  message: any;
}
type MotorKeyPlus = "motorXState" | "motorYState" | "motorZState";
type MotorKeyMinus = "motorXRevState" | "motorYRevState" | "motorZRevState";
const { Title, Text } = Typography;
const socket = io("http://localhost:5000");
import './hover.css';

export default function SmartFarmControl() {
  //take photo
  const [captureLoading, setCaptureLoading] = useState(false);
  // camera adjust TOP
  const [brightnessTop, setBrightnessTop] = useState(0);
  const [contrastTop, setContrastTop] = useState(0);
  const [definitionTop, setDefinitionTop] = useState(0);
  const [saturationTop, setSaturationTop] = useState(0);
  const [zoomTop, setZoomTop] = useState(0);
  // cameara adjust SIDE
  const [brightnessSide, setBrightnessSide] = useState(0);
  const [contrastSide, setContrastSide] = useState(0);
  const [definitionSide, setDefinitionSide] = useState(0);
  const [saturationSide, setSaturationSide] = useState(0);
  const [zoomSide, setZoomSide] = useState(0);
  const [activeMove, setActiveMove] = useState<MoveKey | null>(null);

  const [activeMoveWater, setActiveMoveWater] = useState<MoveKey | null>(null);
  const [activeMovSoil, setActiveMoveSoil] = useState<MoveKey | null>(null);
  const [activeMovtop, setActiveMovetop] = useState<MoveKey | null>(null);
  const [activeMovside, setActiveMoveside] = useState<MoveKey | null>(null);
  //jog xyz
  const [xPlus, setXPlus] = useState(false)
  const [xMinus, setXMinus] = useState(false)
  const [yPlus, setYPlus] = useState(false)
  const [yMinus, setYMinus] = useState(false)
  const [zPlus, setZPlus] = useState(false)
  const [zMinus, setZMinus] = useState(false)
  // State ปั๊มน้ำ
  const [isPumpOn, setIsPumpOn] = useState<boolean | null>(null);
  const [pumpLoading, setPumpLoading] = useState<boolean>(false);

  // State หลอดไฟ
  // const [isLightOn, setIsLightOn] = useState<boolean | null>(null);
  const [lightManualState, setLightManualState] = useState<boolean>(false);
  const [lightLoading, setLightLoading] = useState<boolean>(false);

  // State mode หลอดไฟ
  // รับค่าครั้งแรกจาก API และอัปเดตต่อด้วย Socket
  const [lightOperationMode, setLightOperationMode] = useState<boolean>(false);
  const [lightOperationModeLoading, SetLightOperationModeLoading] = useState<boolean>(false);
  // current status
  const [currentStatus, setCurrentStatus] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  // สำหรับเวลา (Start / End)
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  // State เครื่องปรับอากาศ
  const [acPowerState, setacPowerState] = useState<boolean>(false);
  const [acLoading, setacLoading] = useState<boolean>(false);
  // State เครื่องปรับอากาศ องศา
  const [acTemp, setAcTemp] = useState<number>(25); // ค่าเริ่มต้น 25
  const [acLTempoading, setAcLoading] = useState<boolean>(false);
  //// ac auto mode 
  const [acAutoMode, setAcAutoMode] = useState<boolean>(false);
  const [acAutoLoading, setAcAutoLoading] = useState<boolean>(false);
  const [acStartTime, setAcStartTime] = useState<dayjs.Dayjs | null>(null);
  const [acEndTime, setAcEndTime] = useState<dayjs.Dayjs | null>(null);
  const [acScheduleLoading, setAcScheduleLoading] = useState<boolean>(false);
  // ac cool mode
  const [acIsCool, setacIsCool] = useState<boolean>(false);
  const [acIsCoolLoad, sacIsCoolLoading] = useState<boolean>(false);

  // dry mode
  const [acIsDry, setaacIsDryl] = useState<boolean>(false);
  const [acIsDryLoad, setacIsDryLoading] = useState<boolean>(false);
  //ac fan speed

  const [acFan, setAcFan] = useState<boolean>(false);
  const [acFanLoad, setacFanLoaDing] = useState<boolean>(false);
  // machine status
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveLoading, setMoveLoading] = useState<boolean>(false);

  // State สำหรับกล้อง (Camera) 
  const [cameraState, setCameraState] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  //  สำหรับ Auto Focus 
  const [autoFocusState, setAutoFocusState] = useState<boolean>(false);
  const [autoFocusLoading, setAutoFocusLoading] = useState<boolean>(false);
  const [autoFocusState2, setAutoFocusState2] = useState<boolean>(false);
  const [autoFocusLoading2, setAutoFocusLoading2] = useState<boolean>(false);

  const [cameraState2, setCameraState2] = useState<boolean>(false);
  const [cameraLoading2, setCameraLoading2] = useState<boolean>(false);
  //stop 
  const [stopLoading, setStopLoading] = useState<boolean>(false);
  //home
  const [homeLoading, setHomeLoading] = useState<boolean>(false);
  // clear alam
  const [clearAlarmLoading, setClearAlarmLoading] = useState<boolean>(false);
  // alarm status
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  // State สำหรับ Manual Mode 
  const [manualState, setManualState] = useState<boolean>(false);
  const [manualLoading, setManualLoading] = useState<boolean>(false);
  // Jog X
  const [motorXState, setmotorXState] = useState<boolean>(false);
  const [motorXStateLoading, setmotorXStateLoading] = useState<boolean>(false);
  const [motorXRevState, setmotorXRevState] = useState<boolean>(false);
  const [motorXRevStateLoading, setmotorXRevStateLoading] = useState<boolean>(false);

  //Jog Y
  const [motorYState, setmotorYState] = useState<boolean>(false);
  const [motorXYtateLoading, setmotorYStateLoading] = useState<boolean>(false);
  const [motorYRevState, setmotorYRevState] = useState<boolean>(false);
  const [motorYRevStateLoading, setmotorYRevStateLoading] = useState<boolean>(false);
  //Jog Z
  const [motorZState, setmotorZState] = useState<boolean>(false);
  const [motorZStateLoading, setmotorZStateLoading] = useState<boolean>(false);
  const [motorZRevState, setmotorZRevState] = useState<boolean>(false);
  const [motorZRevStateLoading, setmotorZRevStateLoading] = useState<boolean>(false);
  const [moveMode, setMoveMode] = useState<MoveMode>("location");
  // camera manual focus top 
  const [manualFocusModeTop, setManualFocusModeTop] = useState(false);
  const [manualFocusValueTop, setManualFocusValueTop] = useState(50); // 0–100
  const [manualFocusLoadingTop, setManualFocusLoadingTop] = useState(false);
  const [manualFocusSendLoadingTop, setManualFocusSendLoadingTop] = useState(false);

  // camera manual focus side
  const [manualFocusMode, setManualFocusMode] = useState(false);
  const [manualFocusValue, setManualFocusValue] = useState(50); // 0–100
  const [manualFocusLoading, setManualFocusLoading] = useState(false);
  const [manualFocusSendLoading, setManualFocusSendLoading] = useState(false);
  // LED control
  const [vegBrightness, setvegBrightness] = useState<number>(25);
  const [bloomBrightness, setbloomBrightness] = useState<number>(25);
  const [uvBrightness, setuvBrightness] = useState<number>(25);
  const MOVE_MODE_LABEL: Record<MoveMode, string> = {
    location: "Move Location",
    water: "Move Water",
    soil: "Move Soil",
    cameraTop: "Camera Top",
    cameraSide: "Camera Side"
  };
  type FieldProps = {
    label: string;
    value: number;
    onChange: (v: number) => void;
  };

  const Field: React.FC<FieldProps> = ({ label, value, onChange }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {label}
      </Text>
      <InputNumber
        value={value}
        onChange={(v) => {
          if (v !== null) onChange(v);
        }}
        style={{ width: "100%" }}
        controls={false}
      />
    </div>
  );

  type MoveMode =
    | "location"
    | "water"
    | "soil"
    | "cameraTop"
    | "cameraSide";
  type MoveItem = { key: MoveKey; label: string };
  // move  A B C D E F
  type MoveKey = "moveA" | "moveB" | "moveC" | "moveD" | "moveE" | "moveF" | "moveA_Water" | "moveB_Water"
    | "moveC_Water" | "moveD_Water" | "moveE_Water" | "moveF_Water" | "moveA_Soil" | "moveB_Soil" | "moveC_Soil"
    | "moveD_Soil" | "moveE_Soil" | "moveF_Soil" | "moveA_CameraTop" | "moveB_CameraTop" | "moveC_CameraTop" |
    "moveD_CameraTop" | "moveE_CameraTop" | "moveF_CameraTop" | "moveF_CameraSide" | "moveA_CameraSide" | "moveB_CameraSide"
    | "moveC_CameraSide" | "moveD_CameraSide" | "moveE_CameraSide";

  const MOVE_LIST_MAP: Record<MoveMode, MoveItem[]> = {
    location: [
      { key: "moveA", label: "MOVE A" },
      { key: "moveB", label: "MOVE B" },
      { key: "moveC", label: "MOVE C" },
      { key: "moveD", label: "MOVE D" },
      { key: "moveE", label: "MOVE E" },
      { key: "moveF", label: "MOVE F" }
    ],

    water: [
      { key: "moveA_Water", label: "MOVE A" },
      { key: "moveB_Water", label: "MOVE B" },
      { key: "moveC_Water", label: "MOVE C" },
      { key: "moveD_Water", label: "MOVE D" },
      { key: "moveE_Water", label: "MOVE E" },
      { key: "moveF_Water", label: "MOVE F" }
    ],

    soil: [
      { key: "moveA_Soil", label: "MOVE A" },
      { key: "moveB_Soil", label: "MOVE B" },
      { key: "moveC_Soil", label: "MOVE C" },
      { key: "moveD_Soil", label: "MOVE D" },
      { key: "moveE_Soil", label: "MOVE E" },
      { key: "moveF_Soil", label: "MOVE F" }
    ],

    cameraTop: [
      { key: "moveA_CameraTop", label: "MOVE A" },
      { key: "moveB_CameraTop", label: "MOVE B" },
      { key: "moveC_CameraTop", label: "MOVE C" },
      { key: "moveD_CameraTop", label: "MOVE D" },
      { key: "moveE_CameraTop", label: "MOVE E" },
      { key: "moveF_CameraTop", label: "MOVE F" }
    ],

    cameraSide: [
      { key: "moveA_CameraSide", label: "MOVE A" },
      { key: "moveB_CameraSide", label: "MOVE B" },
      { key: "moveC_CameraSide", label: "MOVE C" },
      { key: "moveD_CameraSide", label: "MOVE D" },
      { key: "moveE_CameraSide", label: "MOVE E" },
      { key: "moveF_CameraSide", label: "MOVE F" }
    ]
  };
  const activeMoveList = MOVE_LIST_MAP[moveMode];
  // ====================== 1. Real-time Sync (MQTT) ======================
  useEffect(() => {
    const onMqttMessage = (data: MqttPayload) => {
      const msg = data.message;
      if (!msg) return;

      if (typeof msg.SV !== 'undefined') setIsPumpOn(msg.SV);
      // if (typeof msg.light_status !== 'undefined') setIsLightOn(msg.light_status);

      // ✅ เมื่อมีข้อมูล Real-time มา ก็อัปเดตใส่ State ตัวเดิม
      if (typeof msg.lightOperationMode !== 'undefined') {
        console.log("⚡ Mode Changed (Socket):", msg.lightOperationMode);
        setLightOperationMode(msg.lightOperationMode);
      }
      // airCon
      if (typeof msg.setAcPower !== 'undefined') {
        console.log("⚡ Mode Changed (Socket):", msg.setAcPower);
        setacPowerState(msg.setAcPower);
      }
      if (typeof msg.acTemp !== 'undefined') {
        setAcTemp(msg.acTemp);
      }
      if (typeof msg.acTimerEnabled !== 'undefined') {
        console.log("❄️ Air Auto Mode Changed:", msg.acTimerEnabled);
        setAcAutoMode(msg.acTimerEnabled);
      }
      // Air Timer Update
      if (typeof msg.acStartHour !== 'undefined' && typeof msg.acStartMinute !== 'undefined') {
        setAcStartTime(dayjs().hour(msg.acStartHour).minute(msg.acStartMinute));
      }
      if (typeof msg.acEndHour !== 'undefined' && typeof msg.acEndMinute !== 'undefined') {
        setAcEndTime(dayjs().hour(msg.acEndHour).minute(msg.acEndMinute));
      }
      // ... (Schedule Logic เดิม) ...
      if (typeof msg.lightStartTimeHour !== 'undefined' && typeof msg.lightStartTimeMinute !== 'undefined') {
        setStartTime(dayjs().hour(msg.lightStartTimeHour).minute(msg.lightStartTimeMinute));
      }
      if (typeof msg.lightEndTimeHour !== 'undefined' && typeof msg.lightEndTimeMinute !== 'undefined') {
        setEndTime(dayjs().hour(msg.lightEndTimeHour).minute(msg.lightEndTimeMinute));
      }
      //check mode 
      if (typeof msg.acIsDry !== 'undefined') {
        console.log("⚡ acIsDry:", msg.acIsDry);
        setaacIsDryl(msg.acIsDry);
      }
      //current status 
      if (typeof msg.currentStatus !== 'undefined') {
        console.log(" currentStatus:", msg.currentStatus);
        setCurrentStatus(msg.currentStatus);
      }
      // check potision 
      if (msg.currentStatus === 'Emergency STOP') {
        console.log("✅ งานเสร็จสิ้น! ปลดล็อคปุ่ม");
        setIsEmergency(true); // แค่ปลดล็อคปุ่ม (ค่า value: false เราส่งไปแล้วใน handleMoveCommand)
      }

      if (msg.currentStatus === 'ALARM CLEAR') {
        console.log("✅ งานเสร็จสิ้น! ปลดล็อคปุ่ม");
        setIsEmergency(false); // แค่ปลดล็อคปุ่ม (ค่า value: false เราส่งไปแล้วใน handleMoveCommand)
      }

      if (typeof msg.isRunning !== 'undefined') {
        console.log("⚡ Machine Running Status:", msg.isRunning);
        setIsMoving(msg.isRunning);
      }
      // check cool mode 
      if (typeof msg.acIsCool !== 'undefined') {
        setacIsCool(msg.acIsCool);
      }
      //check camera 
      if (typeof msg.service_control_cam1 !== 'undefined') {
        console.log("📷 Camera Status Changed:", msg.service_control_cam1);
        setCameraState(msg.service_control_cam1);
      }
      if (typeof msg.service_control_cam2 !== 'undefined') {
        console.log("📷 Camera Status Changed:", msg.service_control_cam2);
        setCameraState2(msg.service_control_cam2);
      }
      // light mode 
      if (typeof msg.lightManualState !== 'undefined') {
        console.log("💡 Light Status Changed:", msg.lightManualState);
        setLightManualState(msg.lightManualState);
      }
      // emergency stop 
      if (msg.stop === true) {
        setIsEmergency(true);
      }
      // auto focus
      if (typeof msg.auto_focus_topview !== 'undefined') {
        console.log("📷 Auto Focus Changed:", msg.auto_focus_topview);
        setAutoFocusState(msg.auto_focus_topview);
      }
      if (typeof msg.auto_focus_sideview !== 'undefined') {
        console.log("📷 Auto Focus Changed:", msg.auto_focus_sideview);
        setAutoFocusState2(msg.auto_focus_sideview);
      }
      // manual focus top
      if (typeof msg.manual_focus_topview !== 'undefined') {
        console.log("⚡ Mode Changed (Socket):", msg.manual_focus_topview);
        setManualFocusModeTop(msg.manual_focus_topview);
      }
      // manual focus seid
      if (typeof msg.manual_focus_sideview !== 'undefined') {
        console.log("⚡ Mode Changed (Socket):", msg.manual_focus_sideview);
        setManualFocusMode(msg.manual_focus_sideview);
      }

      //  Manual State
      if (typeof msg.manualState !== 'undefined') {
        console.log("🛠 Manual Mode Changed:", msg.manualState);
        setManualState(msg.manualState);
      }
      // LED contrl
      if (typeof msg.vegBrightness !== 'undefined') { console.log(msg.vegBrightness); setvegBrightness(msg.vegBrightness); }
      if (typeof msg.bloomBrightness !== 'undefined') { console.log(msg.bloomBrightness); setbloomBrightness(msg.bloomBrightness); }
      if (typeof msg.uvBrightness !== 'undefined') { console.log(msg.uvBrightness); setuvBrightness(msg.uvBrightness); }
      //camera settting top
      if (typeof msg.brightness_topview !== 'undefined') { console.log(msg.brightness_topview); setBrightnessTop(msg.brightness_topview); }
      if (typeof msg.contrast_topview !== 'undefined') { console.log(msg.contrast_topview); setContrastTop(msg.contrast_topview); }
      if (typeof msg.definition_topview !== 'undefined') { console.log(msg.definition_topview); setDefinitionTop(msg.definition_topview); }
      if (typeof msg.saturation_topview !== 'undefined') { console.log(msg.saturation_topview); setSaturationTop(msg.saturation_topview); }
      if (typeof msg.zoom_topview !== 'undefined') { console.log(msg.zoom_topview); setZoomTop(msg.zoom_topview); }
      // camera setting side 
      if (typeof msg.brightness_sideview !== 'undefined') { console.log(msg.brightness_sideview); setBrightnessSide(msg.brightness_sideview); }
      if (typeof msg.contrast_sideview !== 'undefined') { console.log(msg.contrast_sideview); setContrastSide(msg.contrast_sideview); }
      if (typeof msg.definition_sideview !== 'undefined') { console.log(msg.definition_sideview); setDefinitionSide(msg.definition_sideview); }
      if (typeof msg.saturation_sideview !== 'undefined') { console.log(msg.saturation_sideview); setSaturationSide(msg.saturation_sideview); }
      if (typeof msg.zoom_sideview !== 'undefined') { console.log(msg.zoom_sideview); setZoomSide(msg.zoom_sideview); }
    };

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("mqtt_feed", onMqttMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("mqtt_feed", onMqttMessage);
    };
  }, []);

  // ====================== 2. โหลดค่าเริ่มต้น (API) ======================
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        // ดึงข้อมูลจาก API
        const response = await fetch("http://localhost:5000/api/allRoutes/info", {
          cache: "no-store"
        });

        if (response.ok) {
          const data = await response.json();
          console.log("ℹ️ Init Attributes (API):", data);


          if (typeof data.lightOperationMode !== 'undefined') {
            setLightOperationMode(data.lightOperationMode);

          }
          if (typeof data.lightManualState !== 'undefined') {
            setLightManualState(data.lightManualState);
          }
          //airCon
          if (typeof data.setAcPower !== 'undefined') {
            setacPowerState(data.setAcPower);
          }
          // air mode
          if (typeof data.acIsDry !== 'undefined') {
            setaacIsDryl(data.acIsDry);
          }
          //airTemp
          if (typeof data.acTemp !== 'undefined') {
            setAcTemp(Number(data.acTemp));
          }
          // air auto mode
          if (typeof data.acTimerEnabled !== 'undefined') setAcAutoMode(data.acTimerEnabled);

          if (typeof data.acStartHour !== 'undefined') {
            setAcStartTime(dayjs().hour(data.acStartHour).minute(data.acStartMinute));
          }
          if (typeof data.acEndHour !== 'undefined') {
            setAcEndTime(dayjs().hour(data.acEndHour).minute(data.acEndMinute));
          }
          //air cool
          if (typeof data.acIsCool !== 'undefined') {
            setacIsCool(data.acIsCool);
          }
          // moveSoil
          // if (typeof data.moveSoil !== 'undefined') {
          //   setIsMoving(data.moveSoil); // ถ้าเป็น true ปุ่มจะ disabled ตามรูป
          // }
          // time auto
          if (typeof data.lightStartTimeHour !== 'undefined' && typeof data.lightStartTimeMinute !== 'undefined') {
            setStartTime(dayjs().hour(data.lightStartTimeHour).minute(data.lightStartTimeMinute));
          }
          if (typeof data.lightEndTimeHour !== 'undefined' && typeof data.lightEndTimeMinute !== 'undefined') {
            setEndTime(dayjs().hour(data.lightEndTimeHour).minute(data.lightEndTimeMinute));
          }
          if (typeof data.vegBrightness !== 'undefined') {
            setvegBrightness(data.vegBrightness);
          }
          if (typeof data.bloomBrightness !== 'undefined') {
            setbloomBrightness(data.bloomBrightness);
          }
          if (typeof data.uvBrightness !== 'undefined') {
            setuvBrightness(data.uvBrightness);
          }
          if (typeof data.acFan !== 'undefined') {
            setAcFan(data.acFan);
          }

          //  Camera 
          // if (typeof data.service_control_cam1 !== 'undefined') setCameraState(data.service_control_cam1);
        }
      } catch (error) {
        console.error("Fetch Info Error:", error);
      }
    };
    fetchAttributes();
  }, []);
  //..-------------------- AttributesTen  ..--------------------//
  useEffect(() => {
    const fetchAttributesTen = async () => {
      try {
        // ดึงข้อมูลจาก API
        const response = await fetch("http://localhost:5000/api/allRoutes/info/ten", {
          cache: "no-store"
        });

        if (response.ok) {
          const data = await response.json();
          console.log("ℹ️ Init Attributes (API):", data);
          //  Camera 
          if (typeof data.service_control_cam1 !== 'undefined') setCameraState(data.service_control_cam1);
          if (typeof data.service_control_cam2 !== 'undefined') setCameraState2(data.service_control_cam2);


        }

      } catch (error) {
        console.error("Fetch Info Error:", error);
      }


    };
    fetchAttributesTen();
  }, []);
  //------------------------cam 1 -------------------------------//
  useEffect(() => {
    const fetchAttributesCam1 = async () => {
      try {
        // ดึงข้อมูลจาก API
        const response = await fetch("http://localhost:5000/api/allRoutes/info/cam1", {
          cache: "no-store"
        });

        if (response.ok) {
          const data = await response.json();
          // auto focus
          if (typeof data.auto_focus_topview !== 'undefined') { setAutoFocusState(data.auto_focus_topview); }

          if (typeof data.manual_focus_topview !== 'undefined') { setManualFocusModeTop(data.manual_focus_topview) };
          if (typeof data.manual_focus_value_topview !== 'undefined') { setManualFocusValueTop(data.manual_focus_value_topview) };
          if (typeof data.brightness_topview !== 'undefined') { setBrightnessTop(data.brightness_topview) };
          if (typeof data.contrast_topview !== 'undefined') { setContrastTop(data.contrast_topview) };
          if (typeof data.definition_topview !== 'undefined') { setDefinitionTop(data.definition_topview) };
          if (typeof data.saturation_topview !== 'undefined') { setSaturationTop(data.saturation_topview) };
          if (typeof data.zoom_topview !== 'undefined') { setZoomTop(data.zoom_topview) };
        }

      } catch (error) {
        console.error("Fetch Info Error:", error);
      }


    };
    fetchAttributesCam1();
  }, []);
  //------------------------cam 2 -------------------------------//
  useEffect(() => {
    const fetchAttributesCam2 = async () => {
      try {
        // ดึงข้อมูลจาก API
        const response = await fetch("http://localhost:5000/api/allRoutes/info/cam2", {
          cache: "no-store"
        });

        if (response.ok) {
          const data = await response.json();
          // auto focus

          if (typeof data.auto_focus_sideview !== 'undefined') { setAutoFocusState2(data.auto_focus_sideview); }
          if (typeof data.manual_focus_sideview !== 'undefined') { setManualFocusModeTop(data.manual_focus_sideview) };
          if (typeof data.manual_focus_value_sideview !== 'undefined') { setManualFocusValue(data.manual_focus_value_sideview) };
          if (typeof data.brightness_sideview !== 'undefined') { setBrightnessSide(data.brightness_sideview) };
          if (typeof data.contrast_sideview !== 'undefined') { setContrastSide(data.contrast_sideview) };
          if (typeof data.definition_sideview !== 'undefined') { setDefinitionSide(data.definition_sideview) };
          if (typeof data.saturation_sideview !== 'undefined') { setSaturationSide(data.saturation_sideview) };
          if (typeof data.zoom_sideview !== 'undefined') { setZoomSide(data.zoom_sideview) };
        }

      } catch (error) {
        console.error("Fetch Info Error:", error);
      }


    };
    fetchAttributesCam2();
  }, []);
  //..-------------------- fetchAttributeDelta  ..--------------------//
  useEffect(() => {
    const fetchAttributeDelta = async () => {
      try {
        // ดึงข้อมูลจาก API
        const response = await fetch("http://localhost:5000/api/allRoutes/info/delta", {
          cache: "no-store"
        });

        if (response.ok) {
          const data = await response.json();
          console.log("ℹ️ Init Attributes (API):", data);
          //  Camera 
          if (typeof data.manualState !== 'undefined') setManualState(data.manualState);
          if (typeof data.motorXState !== 'undefined') { setXPlus(data.motorXState) };
          if (typeof data.motorXRevState !== 'undefined') { setXMinus(data.motorXRevState) };
          if (typeof data.motorYState !== 'undefined') { setYPlus(data.motorYState) };
          if (typeof data.motorYRevState !== 'undefined') { setYMinus(data.motorYRevState) };
          if (typeof data.motorZState !== 'undefined') { setZPlus(data.motorZState) };
          if (typeof data.motorZRevState !== 'undefined') { setZMinus(data.motorZRevState) };
          if (typeof data.isRunning != 'undefined') { setIsMoving(data.isRunning) };
          if (data.currentStatus === 'Emergency STOP') { setIsEmergency(true) };
          if (data.currentStatus === 'ALARM CLEAR') { setIsEmergency(false) };
          if (typeof data.currentStatus !== 'undefined') { setCurrentStatus(data.currentStatus) };


        };
      } catch (error) {
        console.error("Fetch Info Error:", error);
      }


    };
    fetchAttributeDelta();
  }, []);
  // ====================== ฟังก์ชันสั่งงาน ======================

  //---------------- move location -----------------------//
  const handleMoveLocation = async (key: MoveKey) => {
    setMoveLoading(true);
    setIsMoving(true); // ล็อคปุ่มทันที

    try {
      // 🔥 ส่ง true
      await fetch("http://localhost:5000/api/allRoutes/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: true })
      });

      message.success(`ส่งคำสั่ง ${key} แล้ว`);

      // 🔁 Pulse: ยิง false ตาม


    } catch (error) {
      console.error(error);
      setIsMoving(false);
      message.error("Connection Error");
    } finally {
      setMoveLoading(false);
    }
  };
  //---------------- move location -----------------------//
  const handleMoveGripper = async (key: string) => {
    setMoveLoading(true);
    setIsMoving(true); // ล็อคปุ่มทันที

    try {
      // 🔥 ส่ง true
      await fetch("http://localhost:5000/api/allRoutes/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: true })
      });

      message.success(`ส่งคำสั่ง ${key} แล้ว`);

      // 🔁 Pulse: ยิง false ตาม


    } catch (error) {
      console.error(error);
      setIsMoving(false);
      message.error("Connection Error");
    } finally {
      setMoveLoading(false);
    }
  };
  //--------------  sv  -----------------------//

  // on of air
  const toggleAir = async (checked: boolean) => {
    setacLoading(true);
    setacPowerState(checked);
    try {
      const response = await fetch("http://localhost:5000/api/allRoutes/set-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "acPowerState", value: checked })
      });
    } catch {
      setacPowerState(!checked); message.error("Error");
    } finally { setacLoading(false); }
  };
  // Save Air Schedule
  const saveAirSchedule = async () => {
    if (!acStartTime || !acEndTime) {
      message.warning("กรุณาระบุเวลาแอร์ให้ครบ");
      return;
    }

    setAcScheduleLoading(true);
    try {
      // 1. เตรียมข้อมูลเวลา (ใช้ชื่อ Key ให้ตรงกับที่อยากเก็บใน ThingsBoard)
      const payload = {
        acStartHour: acStartTime.hour(),
        acStartMinute: acStartTime.minute(),
        acEndHour: acEndTime.hour(),
        acEndMinute: acEndTime.minute()
      };

      // 2. ยิงไปที่ Route ใหม่ สำหรับตั้งเวลาแอร์โดยเฉพาะ
      await fetch("http://localhost:5000/api/allRoutes/set-attribute/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) // ✅ ส่งเวลาไปจริงๆ
      });

      message.success("บันทึกเวลาแอร์สำเร็จ!");
    } catch (error) {
      console.error(error);
      message.error("บันทึกเวลาไม่สำเร็จ");
    } finally {
      setAcScheduleLoading(false);
    }
  };
  /// LED CHANG
  const handleLightChange = async (type: 'veg' | 'bloom' | 'uv', newValue: number | null) => {
    // 1. Validation: กันค่า Null หรือค่าที่หลุดช่วง
    if (newValue === null || newValue < 0 || newValue > 100) return;
    let targetKey = "";
    let setTargetState: (val: number) => void;
    let oldValue: number;

    // Map ค่าตาม Type ที่ส่งมา
    switch (type) {
      case 'veg':
        targetKey = "vegBrightness"; // *แก้เป็น Key จริงที่หลังบ้านใช้*
        setTargetState = setvegBrightness;
        oldValue = vegBrightness;
        break;
      case 'bloom':
        targetKey = "bloomBrightness"; // *แก้เป็น Key จริงที่หลังบ้านใช้*
        setTargetState = setbloomBrightness;
        oldValue = bloomBrightness;
        break;
      case 'uv':
        targetKey = "uvBrightness";    // *แก้เป็น Key จริงที่หลังบ้านใช้*
        setTargetState = setuvBrightness;
        oldValue = uvBrightness;
        break;
      default:
        return;
    }

    // 2. Optimistic Update: เปลี่ยนค่าที่หน้าจอก่อนทันที เพื่อความลื่นไหล
    setTargetState(newValue);

    try {
      // 3. ยิง API (ใช้ Debounce จะดีกว่าสำหรับ Slider แต่เขียนแบบตรงไปตรงมาก่อน)
      const response = await fetch("http://localhost:5000/api/allRoutes/set-attribute/namo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: targetKey, value: newValue })
      });

      if (!response.ok) throw new Error("Update Failed");

      // Slider มักจะไม่ใส่ message.success เพราะมันจะเด้งรัวเกินไปถ้ารูดเมาส์
      // แต่ถ้าอยากใส่ แนะนำให้เช็คว่าเป็น InputNumber หรือใช้ Debounce

    } catch (error) {
      // 4. Error Handling: ถ้าพัง ดีดค่ากลับเป็นค่าเดิม (Rollback)
      setTargetState(oldValue);
      message.error(`บันทึกค่า ${type} ไม่สำเร็จ`);
      console.error(error);
    }
  };
  ///air temp
  const adjustTemp = async (change: number) => {
    const newTemp = acTemp + change;

    // กันไม่ให้ปรับเกินลิมิต (เช่น ห้ามต่ำกว่า 18 หรือสูงกว่า 30)
    if (newTemp < 18 || newTemp > 30) {
      message.warning("อุณหภูมิต้องอยู่ระหว่าง 18 - 30 องศา");
      return;
    }
    // Optimistic Update: เปลี่ยนเลขที่หน้าจอก่อนเลยเพื่อความลื่น
    setAcTemp(newTemp);
    setAcLoading(true);

    try {
      // ส่งค่าไปบันทึกที่ Backend (ต้องไปเพิ่ม Route นี้ที่ backend ด้วย หรือใช้ route generic)
      // สมมติว่าใช้ API บันทึก Attribute
      const response = await fetch("http://localhost:5000/api/allRoutes/set-attribute/namo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "acTemp", value: newTemp })
      });

      if (!response.ok) throw new Error("Update Failed");

      message.success(`ปรับอุณหภูมิเป็น ${newTemp}°C`);

    } catch (error) {
      // ถ้าพัง ให้ดีดค่ากลับเป็นค่าเดิม
      setAcTemp(acTemp);
      message.error("บันทึกอุณหภูมิไม่สำเร็จ");
    } finally {
      setAcLoading(false);
    }
  };

  const saveSchedule = async () => {
    if (!startTime || !endTime) { message.warning("กรุณาเลือกเวลาให้ครบ"); return; }
    setScheduleLoading(true);
    try {
      // เตรียมข้อมูล (ชื่อ Key ต้องตรงกับใน ThingsBoard เป๊ะๆ)
      const payload = {
        lightStartTimeHour: startTime.hour(),
        lightStartTimeMinute: startTime.minute(),
        lightEndTimeHour: endTime.hour(),
        lightEndTimeMinute: endTime.minute()
      };
      const response = await fetch("http://localhost:5000/api/allRoutes/set-attribute/multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) // ส่งก้อน Object ไปเลย
      });
      if (response.ok) message.success("บันทึกเวลาทำงานสำเร็จ!");
      else message.error("บันทึกไม่สำเร็จ");
    } catch (error) {
      console.error(error);
      message.error("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setScheduleLoading(false);
    }

  };

  //--------------jog Mode ---------------------------//
  const jogMotorPlus = async (key: MotorKeyPlus, checked: boolean) => {
    // เลือก setState ตาม key
    const setStateMap = {
      motorXState: setmotorXState,
      motorYState: setmotorYState,
      motorZState: setmotorZState

    };

    const setLoadingMap = {
      motorXState: setmotorXStateLoading,
      motorYState: setmotorYStateLoading,
      motorZState: setmotorZStateLoading
    };

    setLoadingMap[key](true);
    setStateMap[key](checked); // update UI ทันที

    try {
      await fetch("http://localhost:5000/api/allRoutes/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,           // 🔥 motorXState | motorYState | motorZState
          value: checked
        })
      });

      message.success(`${key} : ${checked ? "ON" : "OFF"}`);
    } catch (err) {
      setStateMap[key](!checked);
      message.error(`Failed to toggle ${key}`);
    } finally {
      setLoadingMap[key](false);
    }
  };
  const jogMotorMinus = async (key: MotorKeyMinus, checked: boolean) => {
    // เลือก setState ตาม key
    const setStateMap = {
      motorXRevState: setmotorXRevState,
      motorYRevState: setmotorYRevState,
      motorZRevState: setmotorZRevState
    };

    const setLoadingMap = {
      motorXRevState: setmotorXStateLoading,
      motorYRevState: setmotorYStateLoading,
      motorZRevState: setmotorZStateLoading
    };

    setLoadingMap[key](true);
    setStateMap[key](checked); // update UI ทันที

    try {
      await fetch("http://localhost:5000/api/allRoutes/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,           // 🔥 motorXState | motorYState | motorZState
          value: checked
        })
      });

      message.success(`${key} : ${checked ? "ON" : "OFF"}`);
    } catch (err) {
      setStateMap[key](!checked);
      message.error(`Failed to toggle ${key}`);
    } finally {
      setLoadingMap[key](false);
    }
  };
  //-------------------manual focus---------------------//
  const sendManualFocusValue = async (value: number) => {
    setManualFocusSendLoading(true);
    try {
      await fetch("http://localhost:5000/api/allRoutes/set-attribute/cam2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "manual_focus_value_sideview",
          value
        })
      });
      message.success(`Focus set to ${value}`);
    } catch {
      message.error("Failed to set focus");
    } finally {
      setManualFocusSendLoading(false);
    }
  };
  const sendManualFocusValueTop = async (value: number) => {
    setManualFocusSendLoadingTop(true);
    try {
      await fetch("http://localhost:5000/api/allRoutes/set-attribute/cam1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "manual_focus_value_topview",
          value
        })
      });
      message.success(`Focus set to ${value}`);
    } catch {
      message.error("Failed to set focus");
    } finally {
      setManualFocusSendLoadingTop(false);
    }
  };
  const saveCameraSettingTop = async () => {
    const settings: Record<string, number> = {
      brightness_topview: brightnessTop,
      contrast_topview: contrastTop,
      definition_topview: definitionTop,
      saturation_topview: saturationTop,
      zoom_topview: zoomTop
    };

    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch("http://localhost:5000/api/allRoutes/set-attribute/cam1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value })
        });
      }

      message.success("Camera settings applied");
    } catch (err) {
      console.error(err);
      message.error("Failed to apply camera settings");
    }
  };

  const saveCameraSettingSide = async () => {
    const settings: Record<string, number> = {
      brightness_sideview: brightnessSide,
      contrast_sideview: contrastSide,
      definition_sideview: definitionSide,
      saturation_sideview: saturationSide,
      zoom_sideview: zoomSide
    };

    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch("http://localhost:5000/api/allRoutes/set-attribute/cam2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value })
        });
      }

      message.success("Camera settings applied");
    } catch (err) {
      console.error(err);
      message.error("Failed to apply camera settings");
    }
  };


  //-------------------//
  type ToggleServiceOptions = {
    checked: boolean;
    keyName: string;
    endpoint: string; // /ten, /cam1, etc.
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    successLabel?: string;
  };
  //-------------------take photo ----------------------------//
  const onCaptureImage = async () => {
     if (!cameraState) return;

  try {
    await fetch("http://localhost:5000/api/allRoutes/set-attribute/cam1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: "camera_picture_topview_A",
        value: "rtsp://191.20.110.189:8554/cam_topview"
      })
    });

    message.success("Camera picture source set");
  } catch (err) {
    console.error(err);
    message.error("Failed to set camera picture");
  }
};
  const toggleService = async ({
    checked,
    keyName,
    endpoint,
    setState,
    setLoading,
    successLabel
  }: ToggleServiceOptions) => {
    setLoading(true);
    setState(checked); // optimistic UI

    try {
      await fetch(`http://localhost:5000/api/allRoutes/set-attribute/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: keyName,
          value: checked
        })
      });

      message.success(
        `${successLabel ?? keyName}: ${checked ? "ON" : "OFF"}`
      );
    } catch (error) {
      setState(!checked); // rollback
      message.error(`Failed to toggle ${successLabel ?? keyName}`);
    } finally {
      setLoading(false);
    }
  };

  //------------camera 1 and 2 -------------------//
  const onToggleCamera1 = (checked: boolean) =>
    toggleService({
      keyName: "service_control_cam1",
      checked,
      endpoint: "ten",
      setState: setCameraState,
      setLoading: setCameraLoading
    });

  const onToggleCamera2 = (checked: boolean) =>
    toggleService({
      keyName: "service_control_cam2",
      checked,
      endpoint: "ten",
      setState: setCameraState2,
      setLoading: setCameraLoading2
    });
  //---------------auto Focus 1-2--------------//
  const onToggleAutoFocus = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "auto_focus_topview",
      endpoint: "cam1",
      setState: setAutoFocusState,
      setLoading: setAutoFocusLoading,
      successLabel: "Auto Focus"
    });
  const onToggleAutoFocus2 = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "auto_focus_sideview",
      endpoint: "cam2",
      setState: setAutoFocusState2,
      setLoading: setAutoFocusLoading2,
      successLabel: "Auto Focus"
    });
  //------------Light -----------//
  const onToggleLight = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "lightManualState",
      endpoint: "namo",
      setState: setLightManualState,
      setLoading: setLightLoading,
      successLabel: "Light"
    });
  //-------------Light Mode -----------//
  const onToggleLightMode = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "lightOperationMode",
      endpoint: "namo",
      setState: setLightOperationMode,
      setLoading: SetLightOperationModeLoading,
      successLabel: "Auto mode"
    });
  // ----------- manual mode ---------------//
  const onToggleManualState = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "manualState",
      endpoint: "delta",
      setState: setManualState,
      setLoading: setManualLoading,
      successLabel: "Manual  mode"
    });
  //--------------  aircon ON/OF----------------//
  const onToggleAirCon = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "setAcPower",
      endpoint: "namo",
      setState: setacPowerState,
      setLoading: setacLoading,
      successLabel: "Cool Mode!"
    });

  // ----------- airCon cool Mode ---------------//
  const onToggleAirCollMode = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "acIsCool",
      endpoint: "namo",
      setState: setacIsCool,
      setLoading: sacIsCoolLoading,
      successLabel: "Cool Mode!"
    });
  //---------------- air mode ------------------//
  const onToggleAirMode = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "acIsDry",
      endpoint: "namo",
      setState: setaacIsDryl,
      setLoading: setacIsDryLoading,
      successLabel: "Ac Mode!"
    });
  //-------------air auto mode ---------------------//
  const onToggleAirAutoMode = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "acTimerEnabled",
      endpoint: "namo",
      setState: setAcAutoMode,
      setLoading: setAcAutoLoading,
      successLabel: "Ac Auto Mode !"
    });
  // ------------------ Fan spped---------------------//
  const onToggleManualFocusTop = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "manual_focus_topview",
      endpoint: "cam1",
      setState: setManualFocusModeTop,
      setLoading: setManualFocusLoadingTop,
      successLabel: "Set Manual Focus !"
    });
  const onToggleManualFocus = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "manual_focus_sideview",
      endpoint: "cam2",
      setState: setManualFocusMode,
      setLoading: setManualFocusLoading,
      successLabel: "Set Manual Focus !"
    });
  const onToggleAirFanSpeed = (checked: boolean) =>
    toggleService({
      checked,
      keyName: "acFan",
      endpoint: "namo",
      setState: setAcFan,
      setLoading: setacFanLoaDing,
      successLabel: "FanMode !"
    });
  //-------------------- button section --------------------//
  type CommandServiceOptions = {
    keyName: string;
    endpoint: string;
    pulseDuration?: number; // ms
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setActive?: React.Dispatch<React.SetStateAction<boolean>>;
    successMessage?: string;
  };

  const Commandservice = async ({
    keyName,
    endpoint,
    pulseDuration = 2000,
    setLoading,
    setActive,
    successMessage = "Command sent"
  }: CommandServiceOptions) => {
    setLoading(true);
    setActive?.(true); // lock UI

    try {

      await fetch(`http://localhost:5000/api/allRoutes/set-attribute/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: keyName,
          value: true
        })
      });

      message.success(successMessage);

      // ⏰ auto reset FALSE
      setTimeout(async () => {
        await fetch(`http://localhost:5000/api/allRoutes/set-attribute/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: keyName,
            value: false
          })
        });
        console.log(`⏰ Pulse reset for ${keyName}`);
      }, pulseDuration);

    } catch (error) {
      console.error(error);
      setActive?.(false);
      message.error("Connection Error");
    } finally {
      setLoading(false);
    }
  };
  //------------------- move soil -----------------//
  const handleMoveCommandSoil = () =>
    Commandservice({
      keyName: "moveSoil",
      endpoint: "delta",
      pulseDuration: 2000,
      setLoading: setMoveLoading,
      setActive: setIsMoving,
      successMessage: "moveSoil!"
    });
  const handleMoveCommandWater = () =>
    Commandservice({
      keyName: "moveWatering",
      endpoint: "delta",
      pulseDuration: 2000,
      setLoading: setMoveLoading,
      setActive: setIsMoving,
      successMessage: "moveWatering!"
    });
  //------------------Home ---------------------------//
  const handleMoveCommandHome = () =>
    Commandservice({
      keyName: "home",
      endpoint: "delta",
      pulseDuration: 2000,
      setLoading: setMoveLoading,
      setActive: setIsMoving,
      successMessage: "Returning to Home Position!"
    });
  const handleMoveClearAlarm = () =>
    Commandservice({
      keyName: "ClearAlarm",
      endpoint: "delta",
      pulseDuration: 2000,
      setLoading: setClearAlarmLoading,
      setActive: setIsMoving,
      successMessage: "ClearAlarm!"
    });
  const onToggleStop = () =>
    Commandservice({
      keyName: "stop",
      endpoint: "delta",
      pulseDuration: 2000,
      setLoading: setStopLoading,
      setActive: setIsEmergency,
      successMessage: "Emergency Stop!!!"
    });
  const isPumpInit = (isPumpOn === null);
  const isLightInit = (lightManualState === null);
  const isLightStatInit = (lightOperationMode === null);
  const isAirInit = (acPowerState === null);
  const isAcAutoInit = (acAutoMode === null);
  const isacIsCool = (acIsCool === null);
  const isacIsDry = (acIsDry == null)
  const isacFan = (acFan == null)
  console.log('xxxxxxxx', acLoading)
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ marginBottom: 30 }}>
        <Title level={2}>Smart Farm Control</Title>
        <Text type="secondary"><WifiOutlined style={{ color: isConnected ? '#52c41a' : '#ff4d4f' }} /> Server Status</Text>
      </div>
      {/* ✅✅✅ ROW 3: Light Timer ✅✅✅ */}
      <Title level={4} style={{ textAlign: 'left', marginTop: 30, marginBottom: 20, color: '#666' }}>Light Settings</Title>

      <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}>
        {/* CARD 3: หลอดไฟ (ON/OFF) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, minHeight: 200 }}>
            <div style={{ marginBottom: 20 }}>
              <BulbOutlined style={{ fontSize: 40, color: '#faad14', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Grow Light</Title>
              <div style={{ height: 24, marginTop: 5 }}>
                {lightOperationMode ? (
                  <Tag icon={<RobotOutlined />} color="processing">Auto Mode Active</Tag>
                ) : (
                  <Text type="secondary">{isLightInit ? "Loading..." : (lightManualState ? "ON" : "OFF")}</Text>
                )}
              </div>
            </div>
            {isLightInit ? <Spin /> : (
              <Switch
                checked={lightManualState}
                //แค่ล็อคไม่ให้กด (ถ้าเป็น Auto = true ปุ่มจะกดไม่ได้)
                disabled={lightOperationMode}
                onChange={onToggleLight}
                loading={lightLoading}
                checkedChildren={<PoweroffOutlined />}
                unCheckedChildren={<PoweroffOutlined />}
                style={{
                  transform: 'scale(1.5)',
                  backgroundColor: lightManualState ? '#faad14' : undefined,
                  opacity: lightOperationMode ? 0.5 : 1
                }}
              />
            )}
          </Card>
        </Col>
        {/* Light Auto Mode */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, minHeight: 200 }}>
            <div style={{ marginBottom: 20 }}>
              <RobotOutlined style={{ fontSize: 40, color: '#722ed1', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Light Auto Mode</Title>
              <Text type="secondary">{lightOperationMode ? "Enabled" : "Disabled"}</Text>
            </div>
            {isLightStatInit ? <Spin /> : (
              <Switch
                checked={lightOperationMode} onChange={onToggleLightMode} loading={lightOperationModeLoading}
                checkedChildren="ON" unCheckedChildren="OFF"
                style={{ transform: 'scale(1.5)', backgroundColor: lightOperationMode ? '#722ed1' : undefined }}
              />
            )}
          </Card>
        </Col>

        {/* Light Timer */}
        <Col xs={24} sm={12} md={6} >
          <Card hoverable style={{ borderRadius: 15, minHeight: 200 }}>
            <div style={{ marginBottom: 15, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#722ed1', marginRight: 10 }} />
              <Text strong style={{ fontSize: 16 }}>Light Timer</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                <TimePicker format="HH:mm" placeholder="Start" value={startTime} onChange={setStartTime} style={{ width: 100, textAlign: 'center' }} disabled={lightOperationMode} />
                <span>-</span>
                <TimePicker format="HH:mm" placeholder="End" value={endTime} onChange={setEndTime} style={{ width: 100, textAlign: 'center' }} disabled={lightOperationMode} />
              </div>
              <Button type="primary" shape="round" icon={<ClockCircleOutlined />} onClick={saveSchedule} loading={scheduleLoading} disabled={!startTime || !endTime || lightOperationMode}
                style={{ width: '100%', maxWidth: 200, backgroundColor: '#722ed1', borderColor: '#722ed1' }}
              >
                Save Schedule
              </Button>
            </div>
          </Card>
        </Col>
        {/*-------------------------- LED LIGHT CONTROL ------------------------------------ */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <BulbOutlined style={{ fontSize: 40, color: '#faad14', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Light Control</Title>
              <div style={{ height: 24, marginBottom: 10 }}>
                {isEmergency ? (
                  <Tag icon={<AlertOutlined />} color="error">EMERGENCY STOP</Tag>
                ) : (
                  <Text type="secondary">ปรับค่าความสว่าง </Text>
                )}
              </div>
            </div>

            {/* --- ส่วนควบคุมแสง 3 ชนิด --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>

              {/* 1. Veg Brightness (White) - 10V */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text strong><span style={{ color: '#faad14' }}>●</span> Veg (White)</Text>
                  <Tag>Max 100</Tag>
                </div>
                <Row gutter={12} align="middle">
                  <Col span={18}>
                    <Slider
                      min={0}
                      max={100}
                      disabled={isEmergency || manualState}
                      value={vegBrightness}
                      onChange={(val) => handleLightChange('veg', val)}
                      trackStyle={{ backgroundColor: '#faad14' }}
                      handleStyle={{ borderColor: '#faad14', backgroundColor: '#faad14' }}
                      tooltip={{ formatter: (value) => `${value}%` }} // โชว์เลขบนปุ่มที่เลื่อนด้วย
                    />
                  </Col>
                  <Col span={6}>
                    <InputNumber
                      min={0}
                      max={100}
                      value={vegBrightness}
                      onChange={(val) => handleLightChange('veg', val)}
                      disabled={isEmergency || manualState}
                      style={{ width: '100%', color: '#faad14', fontWeight: 'bold' }}
                      formatter={value => `${value}%`} // โชว์ % ข้างหลังตัวเลข
                    // parser={value => value.replace('%', '')}
                    />
                  </Col>
                </Row>
              </div>

              {/* 2. Bloom Brightness (Red) - 5V */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text strong><span style={{ color: '#ff4d4f' }}>●</span> Bloom (Red)</Text>
                  <Tag>Max 100</Tag>
                </div>
                <Row gutter={12} align="middle">
                  <Col span={18}>
                    <Slider
                      min={0}
                      max={100}
                      disabled={isEmergency || manualState}
                      value={bloomBrightness}
                      onChange={(val) => handleLightChange('bloom', val)}
                      trackStyle={{ backgroundColor: '#ff4d4f' }}
                      handleStyle={{ borderColor: '#ff4d4f', backgroundColor: '#ff4d4f' }}
                      tooltip={{ formatter: (value) => `${value}%` }}
                    />
                  </Col>
                  <Col span={6}>
                    <InputNumber
                      min={0}
                      max={100}
                      value={bloomBrightness}
                      onChange={(val) => handleLightChange('bloom', val)}
                      disabled={isEmergency || manualState}
                      style={{ width: '100%', color: '#ff4d4f', fontWeight: 'bold' }}
                      formatter={value => `${value}%`}
                    // parser={value => value.replace('%', '')}
                    />
                  </Col>
                </Row>
              </div>

              {/* 3. UV Brightness (Purple) - 5V */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text strong><span style={{ color: '#722ed1' }}>●</span> UV (Purple)</Text>
                  <Tag>Max 100</Tag>
                </div>
                <Row gutter={12} align="middle">
                  <Col span={18}>
                    <Slider
                      min={0}
                      max={100}
                      disabled={isEmergency || manualState}
                      value={uvBrightness}
                      onChange={(val) => handleLightChange('uv', val)}
                      trackStyle={{ backgroundColor: '#722ed1' }}
                      handleStyle={{ borderColor: '#722ed1', backgroundColor: '#722ed1' }}
                      tooltip={{ formatter: (value) => `${value}%` }}
                    />
                  </Col>
                  <Col span={6}>
                    <InputNumber
                      min={0}
                      max={100}
                      value={uvBrightness}
                      onChange={(val) => handleLightChange('uv', val)}
                      disabled={isEmergency || manualState}
                      style={{ width: '100%', color: '#722ed1', fontWeight: 'bold' }}
                      formatter={value => `${value}%`}
                    // parser={value => value.replace('%', '')}
                    />
                  </Col>
                </Row>
              </div>

            </div>
          </Card>
        </Col>
      </Row>

      {/* ✅✅✅ ROW 2: Air Control Details ✅✅✅ */}
      <Title level={4} style={{ textAlign: 'left', marginTop: 30, marginBottom: 20, color: '#666' }}>Air Condition Settings</Title>

      <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}> {/* ยืดความสูงให้เท่ากัน */}
        {/* CARD 2: แอร์ (ON/OFF) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color="#1677ff" strokeWidth={1.8} />
              <Title level={4} style={{ margin: 0 }}>Air Conditioner</Title>
              <Text type="secondary">{isAirInit ? "รอข้อมูล..." : (acPowerState ? "OPEN" : "CLOSED")}</Text>
            </div>
            {isAirInit ? <Spin /> : (
              <Switch
                checked={acPowerState} onChange={onToggleAirCon} loading={acLoading}
                checkedChildren={<PoweroffOutlined />} unCheckedChildren={<PoweroffOutlined />}
                style={{ transform: 'scale(1.5)', backgroundColor: acPowerState ? '#52c41a' : undefined }}
              />
            )}
          </Card>
        </Col>
        {/* Air Temp Control */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <CloudOutlined style={{ fontSize: 40, color: '#36cfc9', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Temperature</Title>
              <Text type="secondary">ปรับอุณหภูมิ</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <Button shape="circle" size="large" icon={<MinusOutlined />} onClick={() => adjustTemp(-1)} disabled={acLoading} />
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <Title level={2} style={{ margin: 0, color: '#36cfc9' }}>{acTemp}°C</Title>
              </div>
              <Button shape="circle" size="large" icon={<PlusOutlined />} onClick={() => adjustTemp(1)} disabled={acLoading} />
            </div>
          </Card>
        </Col>

        {/* Air Cool Mode */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color="#1677ff" strokeWidth={1.8} />
              <Title level={4} style={{ margin: 0 }}>Cool Mode</Title>
              <Text type="secondary">{isacIsCool ? "Loading..." : (acIsCool ? "COOL ON" : "COOL OFF")}</Text>
            </div>
            {isacIsCool ? <Spin /> : (
              <Switch
                checked={acIsCool} onChange={onToggleAirCollMode} loading={acIsCoolLoad}
                checkedChildren={<PoweroffOutlined />} unCheckedChildren={<PoweroffOutlined />}
                style={{ transform: 'scale(1.5)', backgroundColor: acIsCool ? '#52c41a' : undefined }}
              />
            )}
          </Card>
        </Col>

        {/* Air Mode (Fan/Dry) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color={acIsDry ? "#1677ff" : "#52c41a"} strokeWidth={1.8} style={{ marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>AC Mode</Title>
              <Text strong style={{ color: acIsDry ? "#1677ff" : "#52c41a", fontSize: 16 }}>
                {acIsDryLoad ? "Loading..." : (acIsDry ? "DRY MODE" : "FAN MODE")}
              </Text>
            </div>
            {isacIsDry ? <Spin /> : (
              <Switch
                checked={acIsDry} onChange={onToggleAirMode} loading={acIsDryLoad}
                checkedChildren="DRY" unCheckedChildren="FAN" disabled={acIsCool}
                style={{ transform: 'scale(1.5)', backgroundColor: acIsDry ? '#1677ff' : '#52c41a' }}
              />
            )}
          </Card>
        </Col>
        {/* Air Fan Spped (Fan/Dry) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Fan size={40} color={acFan ? "#1677ff" : "#52c41a"} strokeWidth={1.8} style={{ marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Fan Speed</Title>
              <Text strong style={{ color: acFan ? "#1677ff" : "#52c41a", fontSize: 16 }}>
                {acFanLoad ? "Loading..." : (acFan ? "STRONG SPEED" : "CALM SPEED")}
              </Text>
            </div>
            {isacFan ? <Spin /> : (
              <Switch
                checked={acFan} onChange={onToggleAirFanSpeed} loading={acFanLoad}
                checkedChildren="STRONG" unCheckedChildren="CALM"
                style={{ transform: 'scale(1.5)', backgroundColor: acFan ? '#1677ff' : '#52c41a' }}
              />
            )}
          </Card>
        </Col>

        {/* Air Auto Schedule (Timer) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Snowflake size={24} color="#36cfc9" style={{ marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>Air Auto Mode</Title>
              </div>
              <Switch
                checked={acAutoMode} onChange={onToggleAirAutoMode} loading={acAutoLoading}
                checkedChildren="ON" unCheckedChildren="OFF"
                style={{ backgroundColor: acAutoMode ? '#36cfc9' : undefined }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
                <TimePicker format="HH:mm" placeholder="Start" value={acStartTime} onChange={setAcStartTime} disabled={acAutoMode} style={{ width: 90, textAlign: 'center' }} />
                <span>-</span>
                <TimePicker format="HH:mm" placeholder="End" value={acEndTime} onChange={setAcEndTime} disabled={acAutoMode} style={{ width: 90, textAlign: 'center' }} />
              </div>
              <Button type="primary" icon={<ClockCircleOutlined />} onClick={saveAirSchedule} loading={acScheduleLoading} disabled={acAutoMode} style={{ backgroundColor: '#36cfc9', borderColor: '#36cfc9', width: '100%' }}>
                Save
              </Button>
            </div>
          </Card>
        </Col>

      </Row>
      {/*---------------Camera Control --------------*/}
      <Title level={4} style={{ textAlign: 'left', marginTop: 30, marginBottom: 20, color: '#666' }}>Camera Control</Title>
      <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}> {/* alignItems: stretch ช่วยให้ Col สูงเท่ากัน */}
        {/* ✅✅✅ CARD 5: CAMERA ✅✅✅ */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            {/* Header */}
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <VideoCameraOutlined
                style={{ fontSize: 40, color: "#ff4d4f", marginBottom: 10 }}
              />
              <Title level={4} style={{ margin: 0 }}>CCTV Camera 1</Title>
              <Text type="secondary">
                {cameraState ? "Active" : "Offline"}
              </Text>
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16
              }}
            >
              <Switch
                checked={cameraState}
                onChange={onToggleCamera1}
                loading={cameraLoading}
                checkedChildren="ON"
                unCheckedChildren="OFF"
                style={{
                  transform: "scale(1.5)",
                  backgroundColor: cameraState ? "#ff4d4f" : undefined
                }}
              />

              <Button
               className="custom-move-btn"
                type="primary"
                icon={<CameraOutlined />}
                onClick={onCaptureImage}
                loading={captureLoading}
                disabled={!cameraState}
                style={{
                  backgroundColor: cameraState ? "#6e6e6eff" : "#d9d9d9",
                  borderColor: cameraState ? "#ff4d4f" : "#d9d9d9",
                  minWidth: 120
                }}
              >
                Capture
              </Button>
            </div>
          </Card>

        </Col>
        {/* ใช้ Col md={6} เพื่อให้ขนาดเท่ากับ Card อื่นๆ */}
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: 15,
              height: '100%',
              overflow: 'hidden',
              padding: 0,
              backgroundColor: '#000' // พื้นหลังดำเวลากล้องปิด
            }}
            bodyStyle={{ padding: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {cameraState ? (
              // 🎥 กรณีเปิดกล้อง: แสดง Iframe เต็มพื้นที่
              <iframe
                src="http://191.20.110.189:8889/cam_topview"
                style={{ width: '100%', height: '100%', border: 'none', minHeight: '180px' }} // minHeight เพื่อดัน Card ให้สูงเท่าเพื่อน
                title="CCTV Feed"
              />
            ) : (
              <iframe
                src="http://191.20.110.189:8889/cam_topview"
                style={{ width: '100%', height: '100%', border: 'none', minHeight: '180px' }} // minHeight เพื่อดัน Card ให้สูงเท่าเพื่อน
                title="CCTV Feed"
              />

            )}
          </Card>
        </Col>
        {/*----------------------  CAMERA  2------------------------*/}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <VideoCameraOutlined style={{ fontSize: 40, color: '#ff4d4f', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>CCTV Camera 2</Title>
              <Text type="secondary">{cameraState2 ? "Active" : "Offline"}</Text>
            </div>
            <Switch
              checked={cameraState2}
              onChange={onToggleCamera2}
              loading={cameraLoading2}
              checkedChildren="ON"
              unCheckedChildren="OFF"

              style={{ transform: 'scale(1.5)', backgroundColor: cameraState2 ? '#ff4d4f' : undefined }}
            />
          </Card>
        </Col>
        {/* ใช้ Col md={6} เพื่อให้ขนาดเท่ากับ Card อื่นๆ */}
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: 15,
              height: '100%',
              overflow: 'hidden',
              padding: 0,
              backgroundColor: '#000' // พื้นหลังดำเวลากล้องปิด
            }}
            bodyStyle={{ padding: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {cameraState2 ? (
              // 🎥 กรณีเปิดกล้อง: แสดง Iframe เต็มพื้นที่
              <iframe
                src="http://191.20.110.189:8889/cam_sideview"
                style={{ width: '100%', height: '100%', border: 'none', minHeight: '180px' }} // minHeight เพื่อดัน Card ให้สูงเท่าเพื่อน
                title="CCTV Feed"
              />
            ) : (
              <iframe
                src="http://191.20.110.189:8889/cam_sideview"
                style={{ width: '100%', height: '100%', border: 'none', minHeight: '180px' }} // minHeight เพื่อดัน Card ให้สูงเท่าเพื่อน
                title="CCTV Feed"
              />

            )}
          </Card>
        </Col>
        {/* ------------- CARD: AUTO FOCUS--------------------------- */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              {/* ใช้สีม่วง (Purple) สื่อถึง Sensor/Detection */}
              <AimOutlined style={{ fontSize: 40, color: '#722ed1', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Auto Focus camera 1</Title>
              <Text type="secondary">{autoFocusState ? "ON" : "OFF"}</Text>
            </div>

            <Switch
              checked={autoFocusState}
              onChange={onToggleAutoFocus}
              loading={autoFocusLoading}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={!cameraState}

              style={{
                transform: 'scale(1.5)',
                // ถ้า Disabled ให้สีจางลง, ถ้าเปิดให้สีม่วง
                backgroundColor: (!cameraState) ? undefined : (autoFocusState ? '#722ed1' : undefined)
              }}
            />
          </Card>
        </Col>
        {/*---------------- manual Focus-------------------------*/}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 15,
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: 10

              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Focus size={24} color="#9254de" style={{ marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>Manual Focus Camera 1</Title>
              </div>

              <Switch
                checked={manualFocusModeTop}
                onChange={onToggleManualFocusTop}
                loading={manualFocusLoadingTop}
                checkedChildren="ON"
                unCheckedChildren="OFF"
                disabled={!cameraState}
                style={{
                  backgroundColor: manualFocusModeTop ? "#9254de" : undefined
                }}
              />
            </div>

            {/* Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ textAlign: "center", fontWeight: 600 }}>
                Focus Level: {manualFocusValueTop}
              </div>

              <Slider
                min={0}
                max={100}
                value={manualFocusValueTop}
                onChange={setManualFocusValueTop}
                onAfterChange={sendManualFocusValueTop}
                disabled={!manualFocusMode}
              />

              {manualFocusSendLoadingTop && (
                <div style={{ textAlign: "center", fontSize: 12, color: "#999" }}>
                  Sending focus value...
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* -------------- CARD: AUTO FOCUS-------------------*/}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              {/* ใช้สีม่วง (Purple) สื่อถึง Sensor/Detection */}
              <AimOutlined style={{ fontSize: 40, color: '#722ed1', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Auto Focus camera 2</Title>
              <Text type="secondary">{autoFocusState2 ? "ON" : "OFF"}</Text>
            </div>

            <Switch
              checked={autoFocusState2}
              onChange={onToggleAutoFocus2}
              loading={autoFocusLoading2}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={!cameraState2}

              style={{
                transform: 'scale(1.5)',
                // ถ้า Disabled ให้สีจางลง, ถ้าเปิดให้สีม่วง
                backgroundColor: (!cameraState2) ? undefined : (autoFocusState2 ? '#722ed1' : undefined)
              }}
            />
          </Card>
        </Col>
        {/*---------------- manual Focus-------------------------*/}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 15,
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: 10

              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Focus size={24} color="#9254de" style={{ marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>Manual Focus Camera 2</Title>
              </div>

              <Switch
                checked={manualFocusMode}
                onChange={onToggleManualFocus}
                loading={manualFocusLoading}
                checkedChildren="ON"
                unCheckedChildren="OFF"
                disabled={!cameraState}
                style={{
                  backgroundColor: manualFocusMode ? "#9254de" : undefined
                }}
              />
            </div>

            {/* Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ textAlign: "center", fontWeight: 600 }}>
                Focus Level: {manualFocusValue}
              </div>

              <Slider
                min={0}
                max={100}
                value={manualFocusValue}
                onChange={setManualFocusValue}
                onAfterChange={sendManualFocusValue}
                disabled={!manualFocusMode}
              />

              {manualFocusSendLoading && (
                <div style={{ textAlign: "center", fontSize: 12, color: "#999" }}>
                  Sending focus value...
                </div>
              )}
            </div>
          </Card>
        </Col>
        {/*----------------------- camera adjust------------------------------- */}
        <Col xs={32} sm={24} md={12}>
          <Card hoverable style={{ borderRadius: 20, height: "100%" }}>
            <Title level={5} style={{ marginBottom: 16 }}>
              Camera Setting 1 (Top View)
            </Title>

            <Row gutter={[12, 12]}>
              <Col span={6}>
                <Field
                  label="Brightness_Topview"
                  value={brightnessTop}
                  onChange={setBrightnessTop}
                />
              </Col>

              <Col span={6}>
                <Field
                  label="contrast_topview"
                  value={contrastTop}
                  onChange={setContrastTop}
                />
              </Col>

              <Col span={6}>
                <Field
                  label="definition_topview"
                  value={definitionTop}
                  onChange={setDefinitionTop}
                />
              </Col>

              <Col span={6}>
                <Field
                  label="saturation_topview"
                  value={saturationTop}
                  onChange={setSaturationTop}
                />
              </Col>
              <Col span={6}>
                <Field
                  label="zoom_topview"
                  value={zoomTop}
                  onChange={setZoomTop}
                />
              </Col>
            </Row>

            <Button
              className="custom-move-btn"
              type="primary"
              block
              style={{ marginTop: 20, backgroundColor: "#722ed1", borderColor: "#722ed1" }}
              onClick={saveCameraSettingTop}
            >
              Apply Setting
            </Button>
          </Card>
        </Col>
        {/*-------------------------- camera setting side------------------------------------ */}
        <Col xs={32} sm={24} md={12}>
          <Card hoverable style={{ borderRadius: 20, height: "100%" }}>
            <Title level={5} style={{ marginBottom: 16 }}>
              Camera Setting 2 (Side View)
            </Title>

            <Row gutter={[12, 12]}>
              <Col span={6}>
                <Field
                  label="Brightness_Sideview"
                  value={brightnessSide}
                  onChange={setBrightnessSide}
                />
              </Col>

              <Col span={6}>
                <Field
                  label="contrast_Sideview"
                  value={contrastSide}
                  onChange={setContrastSide}
                />
              </Col>

              <Col span={6}>
                <Field
                  label="definition_Sideview"
                  value={definitionSide}
                  onChange={setDefinitionSide}
                />
              </Col>

              <Col span={6}>
                <Field
                  label="saturation_sideview"
                  value={saturationSide}
                  onChange={setSaturationSide}
                />
              </Col>
              <Col span={6}>
                <Field
                  label="zoom_Sideview"
                  value={zoomSide}
                  onChange={setZoomSide}
                />
              </Col>
            </Row>

            <Button
              className="custom-move-btn"
              type="primary"
              block
              style={{ marginTop: 20, backgroundColor: "#722ed1", borderColor: "#722ed1" }}
              onClick={saveCameraSettingSide}
            >
              Apply
            </Button>
          </Card>
        </Col>
      </Row>

      {/*----------------- General control -----------------------*/}
      <Title level={4} style={{ textAlign: 'left', marginTop: 30, marginBottom: 20, color: '#666' }}>General control</Title>
      {/* ROW 1: Quick Controls */}
      {/* ใช้ gutter และให้ Card ทุกใบยืดความสูงเต็ม (height: 100%) */}
      <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}> {/* alignItems: stretch ช่วยให้ Col สูงเท่ากัน */}

        {/* CARD 1: ปั๊มน้ำ
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <CloudOutlined style={{ fontSize: 40, color: '#1890ff', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Solenoid Valve</Title>
              <Text type="secondary">{isPumpInit ? "Loading..." : (isPumpOn ? "OPEN" : "CLOSED")}</Text>
            </div>
            {isPumpInit ? <Spin /> : (
              <Switch
                checked={isPumpOn} onChange={togglePump} loading={pumpLoading}
                checkedChildren={<PoweroffOutlined />} unCheckedChildren={<PoweroffOutlined />}
                style={{ transform: 'scale(1.5)', backgroundColor: isPumpOn ? '#52c41a' : undefined }}
              />
            )}
          </Card>
        </Col> */}
        {/* ✅✅✅ CARD: MANUAL MODE ✅✅✅ */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              {/* ใช้สีส้มเหลือง สื่อถึงการซ่อมบำรุง/ควบคุมเอง */}
              <ToolOutlined style={{ fontSize: 40, color: '#faad14', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Manual Mode</Title>
              <Text type="secondary">{manualState ? "Manual Only" : "Auto/Remote"}</Text>
            </div>

            <Switch
              disabled={isEmergency}
              checked={manualState}
              onChange={onToggleManualState}
              loading={manualLoading}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              style={{
                transform: 'scale(1.5)',
                backgroundColor: manualState ? '#faad14' : undefined
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable={!manualState} style={{ borderRadius: 15, height: '100%' }}>

            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Manual Movement</Title>
              <Text type="secondary">Jog Control (X / Y / Z)</Text>
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>

              {/* X AXIS */}
              <Row justify="space-between" align="middle">
                <Text strong>X Axis</Text>
                <Space>
                  {/* X- */}
                  <Button
                    icon={<MinusOutlined />}
                    danger
                    type={xMinus ? "primary" : "default"}
                    disabled={isEmergency || !manualState || xPlus}
                    style={{
                      backgroundColor: xMinus ? "#ff4d4f" : undefined,
                      borderColor: xMinus ? "#ff4d4f" : undefined,
                      color: xMinus ? "#fff" : undefined
                    }}
                    onClick={() => {
                      const next = !xMinus
                      setXMinus(next)
                      jogMotorMinus("motorXRevState", next)

                      // ป้องกันเปิด + และ - พร้อมกัน
                      if (next) {
                        setXPlus(false)
                        jogMotorPlus("motorXState", false)
                      }
                    }}
                  />

                  {/* X+ */}
                  <Button
                    icon={<PlusOutlined />}
                    disabled={isEmergency || !manualState || xMinus}
                    type={xPlus ? "primary" : "default"}
                    style={{
                      backgroundColor: xPlus ? "#52c41a" : undefined,
                      borderColor: xPlus ? "#52c41a" : undefined,
                      color: xPlus ? "#fff" : undefined
                    }}
                    onClick={() => {
                      const next = !xPlus
                      setXPlus(next)
                      jogMotorPlus("motorXState", next)

                      // ปิดฝั่งตรงข้าม
                      if (next) {
                        setXMinus(false)
                        jogMotorMinus("motorXRevState", false)
                      }
                    }}
                  />
                </Space>
              </Row>

              {/* Y AXIS */}
              <Row justify="space-between" align="middle">
                <Text strong>Y Axis</Text>
                <Space>
                  {/* X- */}
                  <Button
                    icon={<MinusOutlined />}
                    danger
                    disabled={isEmergency || !manualState || yPlus}
                    type={yMinus ? "primary" : "default"}
                    style={{
                      backgroundColor: yMinus ? "#ff4d4f" : undefined,
                      borderColor: yMinus ? "#ff4d4f" : undefined,
                      color: yMinus ? "#fff" : undefined
                    }}
                    onClick={() => {
                      const next = !yMinus
                      setYMinus(next)
                      jogMotorMinus("motorYRevState", next)

                      // ป้องกันเปิด + และ - พร้อมกัน
                      if (next) {
                        setYPlus(false)
                        jogMotorPlus("motorYState", false)
                      }
                    }}
                  />

                  {/* X+ */}
                  <Button
                    icon={<PlusOutlined />}
                    type={yPlus ? "primary" : "default"}
                    disabled={isEmergency || !manualState || yMinus}
                    style={{
                      backgroundColor: yPlus ? "#52c41a" : undefined,
                      borderColor: yPlus ? "#52c41a" : undefined,
                      color: yPlus ? "#fff" : undefined,

                    }}
                    onClick={() => {
                      const next = !yPlus
                      setYPlus(next)
                      jogMotorPlus("motorYState", next)

                      // ปิดฝั่งตรงข้าม
                      if (next) {
                        setYMinus(false)
                        jogMotorMinus("motorYRevState", false)
                      }
                    }}
                  />
                </Space>
              </Row>

              {/* Z AXIS */}
              <Row justify="space-between" align="middle">
                <Text strong>Z Axis</Text>
                <Space>
                  {/* X- */}
                  <Button
                    icon={<MinusOutlined />}
                    danger
                    disabled={isEmergency || !manualState || zPlus}
                    type={zMinus ? "primary" : "default"}
                    style={{
                      backgroundColor: zMinus ? "#ff4d4f" : undefined,
                      borderColor: zMinus ? "#ff4d4f" : undefined,
                      color: zMinus ? "#fff" : undefined
                    }}
                    onClick={() => {
                      const next = !zMinus
                      setZMinus(next)
                      jogMotorMinus("motorZRevState", next)

                      // ป้องกันเปิด + และ - พร้อมกัน
                      if (next) {
                        setZPlus(false)
                        jogMotorPlus("motorZState", false)
                      }
                    }}
                  />

                  {/* X+ */}
                  <Button
                    icon={<PlusOutlined />}
                    type={zPlus ? "primary" : "default"}
                    disabled={isEmergency || !manualState || zMinus}
                    style={{
                      backgroundColor: zPlus ? "#52c41a" : undefined,
                      borderColor: zPlus ? "#52c41a" : undefined,
                      color: zPlus ? "#fff" : undefined
                    }}
                    onClick={() => {
                      const next = !zPlus
                      setZPlus(next)
                      jogMotorPlus("motorZState", next)

                      // ปิดฝั่งตรงข้าม
                      if (next) {
                        setZMinus(false)
                        jogMotorMinus("motorZRevState", false)
                      }
                    }}
                  />
                </Space>
              </Row>

            </Space>

          </Card>
        </Col>
        {/* CARD 4: Move Device */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <ArrowsAltOutlined style={{ fontSize: 40, color: '#eb2f96', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Device Movement</Title>
              <div style={{ height: 24 }}>
                {/* ✅✅✅ แก้ไขตรงนี้: เพิ่มเงื่อนไข isEmergency ✅✅✅ */}
                {isEmergency ? (
                  <Tag icon={<AlertOutlined />} color="error">EMERGENCY STOP</Tag>
                ) : isMoving ? (
                  <Tag icon={<SyncOutlined spin />} color="processing">MOVING...</Tag>
                ) : (
                  <Text type="secondary">พร้อมทำงาน</Text>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleMoveCommandSoil}
                loading={moveLoading}
                disabled={isMoving || isEmergency || manualState}
                style={{
                  backgroundColor: (isMoving || isEmergency || manualState) ? undefined : '#eb2f96',
                  borderColor: (isMoving || isEmergency || manualState) ? undefined : '#eb2f96',
                  minWidth: 120
                }}
              >
                {isMoving ? "Moving..." : "MOVE SOIL"}
              </Button>
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleMoveCommandWater}
                loading={moveLoading}
                disabled={isMoving || isEmergency || manualState}
                style={{
                  backgroundColor: (isMoving || isEmergency || manualState) ? undefined : '#22cceeff',
                  borderColor: (isMoving || isEmergency || manualState) ? undefined : '#22cceeff',
                  minWidth: 120
                }}
              >
                {isMoving ? "Moving..." : "MOVE WATER"}
              </Button>
              {/* ปุ่ม Stop จะปรากฏขึ้นเมื่อเครื่องกำลังทำงาน (isMoving) */}
              {/* {isMoving && (
                <Button
                  type="primary" // เพิ่มเพื่อให้สีแดงเต็มปุ่ม
                  danger
                  shape="circle"
                  size="large"
                  icon={<StopOutlined />}
                  loading={stopLoading}     // ✅ ใช้สถานะ Loading ของ Stop
                  onClick={onToggleStop} // ✅ เชื่อมต่อฟังก์ชันที่คุณเขียนไว้
                  disabled={isEmergency}     // ถ้ากดไปแล้วหรืออยู่ในสถานะ Emergency ไม่ให้กดซ้ำ
                />
              )} */}
            </div>
          </Card>
        </Col>
        {/* ✅✅✅ CARD 5: EMERGENCY STOP ✅✅✅ */}
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: 15,
              height: '100%',
              // ถ้า Emergency อยู่ ให้ขอบแดงกระพริบ หรือหนาขึ้น
              borderColor: isEmergency ? '#ff0004de' : '#ff0004de',
              borderWidth: isEmergency ? '3px' : '1px',
              backgroundColor: isEmergency ? '#fff1f0' : undefined // พื้นหลังแดงอ่อนๆ ถ้า Stop อยู่
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <AlertOutlined style={{ fontSize: 40, color: '#ff0004de', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0, color: '#ff0004ff' }}>Emergency Stop</Title>
              <Text type="secondary">{isEmergency ? "STOPPED" : "System Running"}</Text>
            </div>

            <Button
              type="primary"
              danger
              shape="round"
              size="large"
              icon={<StopOutlined />}
              onClick={onToggleStop}
              loading={stopLoading}
              // Stop กดได้ตลอด หรือจะให้กดได้เฉพาะตอนเครื่องเดินก็ได้
              disabled={isEmergency} // ถ้า Stop อยู่แล้ว ไม่ต้องกดซ้ำ
              style={{ minWidth: 120, height: 45, fontSize: 16, fontWeight: 'bold' }}
            >
              STOP
            </Button>
          </Card>
        </Col>

        {/* ✅✅✅ CARD: CLEAR ALARM ✅✅✅ */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <SafetyCertificateOutlined
                style={{ fontSize: 40, color: isEmergency ? '#fa8c16' : '#d9d9d9', marginBottom: 10 }}
              />
              <Title level={4} style={{ margin: 0 }}>Clear Alarm</Title>
              <Text type="secondary">Reset Errors</Text>
            </div>

            <Button
              type="primary"
              shape="round"
              size="large"
              icon={<ClearOutlined />}
              onClick={handleMoveClearAlarm}
              loading={clearAlarmLoading}


              disabled={!isEmergency}

              style={{
                backgroundColor: isEmergency ? '#fa8c16' : undefined, // สีส้มเมื่อกดได้
                borderColor: isEmergency ? '#fa8c16' : undefined,
                minWidth: 120
              }}
            >
              CLEAR
            </Button>
          </Card>
        </Col>
        {/*  ------------CARD: RETURN HOME ----------------------*/}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <HomeOutlined style={{ fontSize: 40, color: '#13c2c2', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Return Home</Title>

              {/* ✅✅✅ แก้ไขตรงนี้: แสดงข้อความแจ้งเตือนถ้า Emergency ✅✅✅ */}
              {isEmergency ? (
                <Text type="danger" strong>EMERGENCY STOP</Text>
              ) : (
                <Text type="secondary">Back to Start</Text>
              )}
            </div>

            <Button
              type="primary"
              shape="round"
              size="large"
              icon={<RollbackOutlined />}
              onClick={handleMoveCommandHome}
              loading={homeLoading}
              disabled={isMoving || isEmergency} // ล็อคปุ่ม
              style={{
                backgroundColor: (isMoving || isEmergency) ? undefined : '#13c2c2',
                borderColor: (isMoving || isEmergency) ? undefined : '#13c2c2',
                minWidth: 120
              }}
            >
              HOME
            </Button>
          </Card>
        </Col>
      </Row>
      {/*----------------- General control -----------------------*/}
      <Title level={4} style={{ textAlign: 'left', marginTop: 30, marginBottom: 20, color: '#666' }}>General Move </Title>
      {/* ROW 1: Quick Controls */}
      {/* ใช้ gutter และให้ Card ทุกใบยืดความสูงเต็ม (height: 100%) */}
      <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}> {/* alignItems: stretch ช่วยให้ Col สูงเท่ากัน */}

        {/*----------------------------- move location -----------------------*/}
        <Col xs={48} sm={24} md={12}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <Select<MoveMode>
              value={moveMode}
              onChange={setMoveMode}
              size="large"
              disabled={isMoving || isEmergency || manualState}
              style={{ width: 260, marginBottom: 16 }}
              options={[
                { label: "Move Location", value: "location" },
                { label: "Move Water", value: "water" },
                { label: "Move Soil", value: "soil" },
                { label: "Camera Top", value: "cameraTop" },
                { label: "Camera Side", value: "cameraSide" }
              ]}
            />
            <div style={{ marginBottom: 20 }}>
              <ArrowsAltOutlined style={{ fontSize: 40, color: '#eb2f96' }} />
              <Title level={3} style={{ margin: 0 }}>
                {MOVE_MODE_LABEL[moveMode]}
              </Title>

              <div style={{ height: 24 }}>
                {isEmergency ? (
                  <Tag icon={<AlertOutlined />} color="error">EMERGENCY STOP</Tag>
                ) : isMoving ? (
                  <Tag icon={<SyncOutlined spin />} color="processing">{currentStatus}...</Tag>
                ) : (
                  <Text>STATUS : {currentStatus}</Text>
                )}
              </div>
            </div>
            <div
              style={{

                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // แบ่งเป็น 2 คอลัมน์ (แถวละ 2 ปุ่ม)
                gap: "12px",
                width: "100%",
                marginBottom: "16px", // เว้นระยะห่างจากปุ่มชุดเดิมด้านล่าง
                boxSizing: "border-box",
              }}
            >
              {[
                { key: "moveGripperS", label: "Get Soil", color: "#87d068" },
                { key: "moveCorrectGripperS", label: "Return Soil", color: "#87d068" },
                { key: "moveGripperW", label: "Get Water", color: "#2db7f5" },
                { key: "moveCorrectGripperW", label: "Return Water", color: "#2db7f5" },
              ].map((item) => (
                <div key={item.key} style={{ width: "100%" }}>
                  <Button
                    className="custom-hover-btn" // เพิ่ม className
                    type="primary"
                    shape="round"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    disabled={isMoving || isEmergency || manualState}
                    onClick={() => handleMoveGripper(item.key)} // หรือเปลี่ยน Function ตามการใช้งานจริง
                    style={{
                      width: "100%",
                      height: "45px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isMoving || isEmergency || manualState ? undefined : item.color,
                      borderColor: isMoving || isEmergency || manualState ? undefined : item.color,
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>{item.label}</span>
                  </Button>
                </div>
              ))}
            </div>

            {/* --- ขีดเส้นคั่นเบาๆ (ถ้าต้องการ) --- */}
            <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", // แบ่ง 3 ช่องเท่ากันเป๊ะ
                gap: "12px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {activeMoveList.map(({ key, label }) => (
                // เพิ่ม div หุ้มเพื่อล็อกขนาด Grid cell
                <div key={key} style={{ width: "100%" }}>
                  <Button
                    className="custom-move-btn"
                    type="primary"
                    shape="round"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    disabled={isMoving || isEmergency || manualState}
                    onClick={() => handleMoveLocation(key)}
                    style={{
                      width: "100%",          // กว้างเต็ม div หุ้ม
                      height: "45px",         // สูงเท่ากันทุกปุ่ม
                      display: "flex",        // ใช้ flex ภายในปุ่ม
                      alignItems: "center",   // จัดกลางแนวตั้ง
                      justifyContent: "center", // จัดกลางแนวนอน
                      padding: "0 8px",       // ระยะห่างข้างในปุ่ม
                      fontSize: "14px",
                      backgroundColor:
                        isMoving || isEmergency || manualState
                          ? undefined
                          : moveMode === "location"
                            ? "#eb2f96"
                            : "#1ba7ecff",
                      borderColor:
                        isMoving || isEmergency || manualState
                          ? undefined
                          : moveMode === "location"
                            ? "#eb2f96"
                            : "#1ba7ecff"
                    }}
                  >
                    <span style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {label}
                    </span>
                  </Button>
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 20,
                width: '100%'
              }}
            >
              <Button
                type="primary"
                danger
                shape="round"
                size="large"
                icon={<StopOutlined />}
                loading={stopLoading}
                onClick={onToggleStop}
                disabled={isEmergency}
                style={{
                  flex: 1,
                  height: 45,
                  fontWeight: 'bold'
                }}
              >
                Emergency Stop
              </Button>
              {/* ปุ่ม CLEAR: คงที่ตลอดเวลา */}
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<ClearOutlined />}
                onClick={handleMoveClearAlarm}
                loading={clearAlarmLoading}

                disabled={!isEmergency}
                style={{
                  flex: 1,
                  height: 45,
                  fontWeight: 'bold',
                  backgroundColor: isEmergency ? '#fa8c16' : undefined,
                  borderColor: isEmergency ? '#fa8c16' : undefined,
                }}
              >
                Clear Alarm
              </Button>
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<HomeOutlined />}
                onClick={handleMoveCommandHome}
                loading={homeLoading}

                disabled={isMoving || isEmergency} // ล็อคปุ่ม
                style={{
                  flex: 1,
                  height: 45,
                  fontWeight: 'bold',

                }}
              >
                Home
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}