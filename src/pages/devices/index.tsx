import React, { useState, useEffect } from "react";
import {
  Switch, Card, message, Typography, Spin, Row, Col, Tag,
  TimePicker, Button, Space, Select, Slider, InputNumber
} from "antd";
import {
  PoweroffOutlined, WifiOutlined, BulbOutlined, CloudOutlined, RobotOutlined,
  ClockCircleOutlined, StopOutlined, PlayCircleOutlined, SyncOutlined,
  ArrowsAltOutlined, MinusOutlined, PlusOutlined, VideoCameraOutlined,
  AlertOutlined, RollbackOutlined, SafetyCertificateOutlined, ClearOutlined,
  HomeOutlined, AimOutlined, ToolOutlined, SaveOutlined, CameraOutlined
} from "@ant-design/icons";
import { ThunderboltOutlined } from "@ant-design/icons";
import { Snowflake, Fan, Focus } from "lucide-react";
import io from "socket.io-client";
import dayjs from "dayjs";

// ✅ Import ทุก API call จากไฟล์กลาง
import {
  fetchInfo, fetchInfoTen, fetchInfoCam1, fetchInfoCam2, fetchInfoDelta,
  setAttribute,
  toggleLight, toggleLightAutoMode, saveLightSchedule,
  setVegBrightness, setBloomBrightness, setUvBrightness,
  toggleAirCon, setAcTemperature, toggleAcCoolMode, toggleAcDryMode,
  toggleAcFanSpeed, toggleAcAutoMode, saveAcSchedule,
  toggleCamera1, toggleCamera2,
  toggleAutoFocusCam1, toggleAutoFocusCam2,
  toggleManualFocusCam1, toggleManualFocusCam2,
  setManualFocusValueCam1, setManualFocusValueCam2,
  saveCameraSettingsCam1, saveCameraSettingsCam2,
  captureImageCam1,
  toggleManualMode,
  setMotorX, setMotorXRev, setMotorY, setMotorYRev, setMotorZ, setMotorZRev,
  sendMoveLocation, sendPulseCommand,
  moveSoil, moveWatering, moveHome, emergencyStop, clearAlarm,
} from "./api";

import "./hover.css";

// ─────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────

interface MqttPayload { topic: string; message: any; }

type MoveMode = "location" | "water" | "soil" | "cameraTop" | "cameraSide";
type MoveKey =
  | "moveA" | "moveB" | "moveC" | "moveD" | "moveE" | "moveF"
  | "moveA_Water" | "moveB_Water" | "moveC_Water" | "moveD_Water" | "moveE_Water" | "moveF_Water"
  | "moveA_Soil" | "moveB_Soil" | "moveC_Soil" | "moveD_Soil" | "moveE_Soil" | "moveF_Soil"
  | "moveA_CameraTop" | "moveB_CameraTop" | "moveC_CameraTop" | "moveD_CameraTop" | "moveE_CameraTop" | "moveF_CameraTop"
  | "moveA_CameraSide" | "moveB_CameraSide" | "moveC_CameraSide" | "moveD_CameraSide" | "moveE_CameraSide" | "moveF_CameraSide";

type MoveItem = { key: MoveKey; label: string };

const { Title, Text } = Typography;
const socket = io("http://localhost:5000");

// ─────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────

const MOVE_MODE_LABEL: Record<MoveMode, string> = {
  location: "Move Location",
  water: "Move Water",
  soil: "Move Soil",
  cameraTop: "Camera Top",
  cameraSide: "Camera Side",
};

const MOVE_LIST_MAP: Record<MoveMode, MoveItem[]> = {
  location: [
    { key: "moveA", label: "MOVE A" }, { key: "moveB", label: "MOVE B" },
    { key: "moveC", label: "MOVE C" }, { key: "moveD", label: "MOVE D" },
    { key: "moveE", label: "MOVE E" }, { key: "moveF", label: "MOVE F" },
  ],
  water: [
    { key: "moveA_Water", label: "MOVE A" }, { key: "moveB_Water", label: "MOVE B" },
    { key: "moveC_Water", label: "MOVE C" }, { key: "moveD_Water", label: "MOVE D" },
    { key: "moveE_Water", label: "MOVE E" }, { key: "moveF_Water", label: "MOVE F" },
  ],
  soil: [
    { key: "moveA_Soil", label: "MOVE A" }, { key: "moveB_Soil", label: "MOVE B" },
    { key: "moveC_Soil", label: "MOVE C" }, { key: "moveD_Soil", label: "MOVE D" },
    { key: "moveE_Soil", label: "MOVE E" }, { key: "moveF_Soil", label: "MOVE F" },
  ],
  cameraTop: [
    { key: "moveA_CameraTop", label: "MOVE A" }, { key: "moveB_CameraTop", label: "MOVE B" },
    { key: "moveC_CameraTop", label: "MOVE C" }, { key: "moveD_CameraTop", label: "MOVE D" },
    { key: "moveE_CameraTop", label: "MOVE E" }, { key: "moveF_CameraTop", label: "MOVE F" },
  ],
  cameraSide: [
    { key: "moveA_CameraSide", label: "MOVE A" }, { key: "moveB_CameraSide", label: "MOVE B" },
    { key: "moveC_CameraSide", label: "MOVE C" }, { key: "moveD_CameraSide", label: "MOVE D" },
    { key: "moveE_CameraSide", label: "MOVE E" }, { key: "moveF_CameraSide", label: "MOVE F" },
  ],
};

// ─────────────────────────────────────────────────────────────
//  Sub-component: Field (InputNumber)
// ─────────────────────────────────────────────────────────────

type FieldProps = { label: string; value: number; onChange: (v: number) => void };
const Field: React.FC<FieldProps> = ({ label, value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
    <InputNumber value={value} onChange={(v) => { if (v !== null) onChange(v); }} style={{ width: "100%" }} controls={false} />
  </div>
);

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────

export default function SmartFarmControl() {

  // ── Connection ──────────────────────────────────────────────
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  // ── Light ───────────────────────────────────────────────────
  const [lightManualState, setLightManualState] = useState<boolean>(false);
  const [lightLoading, setLightLoading] = useState<boolean>(false);
  const [lightOperationMode, setLightOperationMode] = useState<boolean>(false);
  const [lightOperationModeLoading, setLightOperationModeLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);

  // ── LED ─────────────────────────────────────────────────────
  const [vegBrightness, setVegBrightnessState] = useState<number>(25);
  const [bloomBrightness, setBloomBrightnessState] = useState<number>(25);
  const [uvBrightness, setUvBrightnessState] = useState<number>(25);

  // ── Air Conditioner ─────────────────────────────────────────
  const [acPowerState, setAcPowerState] = useState<boolean>(false);
  const [acLoading, setAcLoading] = useState<boolean>(false);
  const [acTemp, setAcTemp] = useState<number>(25);
  const [acTempLoading, setAcTempLoading] = useState<boolean>(false);
  const [acAutoMode, setAcAutoMode] = useState<boolean>(false);
  const [acAutoLoading, setAcAutoLoading] = useState<boolean>(false);
  const [acStartTime, setAcStartTime] = useState<dayjs.Dayjs | null>(null);
  const [acEndTime, setAcEndTime] = useState<dayjs.Dayjs | null>(null);
  const [acScheduleLoading, setAcScheduleLoading] = useState<boolean>(false);
  const [acIsCool, setAcIsCool] = useState<boolean>(false);
  const [acIsCoolLoad, setAcIsCoolLoading] = useState<boolean>(false);
  const [acIsDry, setAcIsDry] = useState<boolean>(false);
  const [acIsDryLoad, setAcIsDryLoading] = useState<boolean>(false);
  const [acFan, setAcFan] = useState<boolean>(false);
  const [acFanLoad, setAcFanLoading] = useState<boolean>(false);

  // ── Camera ──────────────────────────────────────────────────
  const [cameraState, setCameraState] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraState2, setCameraState2] = useState<boolean>(false);
  const [cameraLoading2, setCameraLoading2] = useState<boolean>(false);
  const [captureLoading, setCaptureLoading] = useState<boolean>(false);
  const [autoFocusState, setAutoFocusState] = useState<boolean>(false);
  const [autoFocusLoading, setAutoFocusLoading] = useState<boolean>(false);
  const [autoFocusState2, setAutoFocusState2] = useState<boolean>(false);
  const [autoFocusLoading2, setAutoFocusLoading2] = useState<boolean>(false);
  const [manualFocusModeTop, setManualFocusModeTop] = useState<boolean>(false);
  const [manualFocusValueTop, setManualFocusValueTop] = useState<number>(50);
  const [manualFocusLoadingTop, setManualFocusLoadingTop] = useState<boolean>(false);
  const [manualFocusSendLoadingTop, setManualFocusSendLoadingTop] = useState<boolean>(false);
  const [manualFocusMode, setManualFocusMode] = useState<boolean>(false);
  const [manualFocusValue, setManualFocusValue] = useState<number>(50);
  const [manualFocusLoading, setManualFocusLoading] = useState<boolean>(false);
  const [manualFocusSendLoading, setManualFocusSendLoading] = useState<boolean>(false);

  // ── Camera Settings ─────────────────────────────────────────
  const [brightnessTop, setBrightnessTop] = useState<number>(0);
  const [contrastTop, setContrastTop] = useState<number>(0);
  const [definitionTop, setDefinitionTop] = useState<number>(0);
  const [saturationTop, setSaturationTop] = useState<number>(0);
  const [zoomTop, setZoomTop] = useState<number>(0);
  const [brightnessSide, setBrightnessSide] = useState<number>(0);
  const [contrastSide, setContrastSide] = useState<number>(0);
  const [definitionSide, setDefinitionSide] = useState<number>(0);
  const [saturationSide, setSaturationSide] = useState<number>(0);
  const [zoomSide, setZoomSide] = useState<number>(0);

  // ── Robot / Motor ───────────────────────────────────────────
  const [manualState, setManualState] = useState<boolean>(false);
  const [manualLoading, setManualLoading] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveLoading, setMoveLoading] = useState<boolean>(false);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [stopLoading, setStopLoading] = useState<boolean>(false);
  const [homeLoading, setHomeLoading] = useState<boolean>(false);
  const [clearAlarmLoading, setClearAlarmLoading] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<string>();
  const [xPlus, setXPlus] = useState<boolean>(false);
  const [xMinus, setXMinus] = useState<boolean>(false);
  const [yPlus, setYPlus] = useState<boolean>(false);
  const [yMinus, setYMinus] = useState<boolean>(false);
  const [zPlus, setZPlus] = useState<boolean>(false);
  const [zMinus, setZMinus] = useState<boolean>(false);
  const [moveMode, setMoveMode] = useState<MoveMode>("location");

  const activeMoveList = MOVE_LIST_MAP[moveMode];

  // ─────────────────────────────────────────────────────────────
  //  1. Real-time Sync (Socket.IO / MQTT)
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const onMqttMessage = (data: MqttPayload) => {
      const msg = data.message;
      if (!msg) return;

      // Light
      if (typeof msg.lightOperationMode !== "undefined") setLightOperationMode(msg.lightOperationMode);
      if (typeof msg.lightManualState !== "undefined") setLightManualState(msg.lightManualState);
      if (typeof msg.lightStartTimeHour !== "undefined" && typeof msg.lightStartTimeMinute !== "undefined")
        setStartTime(dayjs().hour(msg.lightStartTimeHour).minute(msg.lightStartTimeMinute));
      if (typeof msg.lightEndTimeHour !== "undefined" && typeof msg.lightEndTimeMinute !== "undefined")
        setEndTime(dayjs().hour(msg.lightEndTimeHour).minute(msg.lightEndTimeMinute));

      // LED
      if (typeof msg.vegBrightness !== "undefined") setVegBrightnessState(msg.vegBrightness);
      if (typeof msg.bloomBrightness !== "undefined") setBloomBrightnessState(msg.bloomBrightness);
      if (typeof msg.uvBrightness !== "undefined") setUvBrightnessState(msg.uvBrightness);

      // Air
      if (typeof msg.setAcPower !== "undefined") setAcPowerState(msg.setAcPower);
      if (typeof msg.acTemp !== "undefined") setAcTemp(msg.acTemp);
      if (typeof msg.acTimerEnabled !== "undefined") setAcAutoMode(msg.acTimerEnabled);
      if (typeof msg.acIsCool !== "undefined") setAcIsCool(msg.acIsCool);
      if (typeof msg.acIsDry !== "undefined") setAcIsDry(msg.acIsDry);
      if (typeof msg.acStartHour !== "undefined" && typeof msg.acStartMinute !== "undefined")
        setAcStartTime(dayjs().hour(msg.acStartHour).minute(msg.acStartMinute));
      if (typeof msg.acEndHour !== "undefined" && typeof msg.acEndMinute !== "undefined")
        setAcEndTime(dayjs().hour(msg.acEndHour).minute(msg.acEndMinute));

      // Camera
      if (typeof msg.service_control_cam1 !== "undefined") setCameraState(msg.service_control_cam1);
      if (typeof msg.service_control_cam2 !== "undefined") setCameraState2(msg.service_control_cam2);
      if (typeof msg.auto_focus_topview !== "undefined") setAutoFocusState(msg.auto_focus_topview);
      if (typeof msg.auto_focus_sideview !== "undefined") setAutoFocusState2(msg.auto_focus_sideview);
      if (typeof msg.manual_focus_topview !== "undefined") setManualFocusModeTop(msg.manual_focus_topview);
      if (typeof msg.manual_focus_sideview !== "undefined") setManualFocusMode(msg.manual_focus_sideview);

      // Camera settings top
      if (typeof msg.brightness_topview !== "undefined") setBrightnessTop(msg.brightness_topview);
      if (typeof msg.contrast_topview !== "undefined") setContrastTop(msg.contrast_topview);
      if (typeof msg.definition_topview !== "undefined") setDefinitionTop(msg.definition_topview);
      if (typeof msg.saturation_topview !== "undefined") setSaturationTop(msg.saturation_topview);
      if (typeof msg.zoom_topview !== "undefined") setZoomTop(msg.zoom_topview);

      // Camera settings side
      if (typeof msg.brightness_sideview !== "undefined") setBrightnessSide(msg.brightness_sideview);
      if (typeof msg.contrast_sideview !== "undefined") setContrastSide(msg.contrast_sideview);
      if (typeof msg.definition_sideview !== "undefined") setDefinitionSide(msg.definition_sideview);
      if (typeof msg.saturation_sideview !== "undefined") setSaturationSide(msg.saturation_sideview);
      if (typeof msg.zoom_sideview !== "undefined") setZoomSide(msg.zoom_sideview);

      // Robot
      if (typeof msg.manualState !== "undefined") setManualState(msg.manualState);
      if (typeof msg.isRunning !== "undefined") setIsMoving(msg.isRunning);
      if (typeof msg.currentStatus !== "undefined") setCurrentStatus(msg.currentStatus);
      if (msg.currentStatus === "Emergency STOP") setIsEmergency(true);
      if (msg.currentStatus === "ALARM CLEAR") setIsEmergency(false);
      if (msg.stop === true) setIsEmergency(true);
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

  // ─────────────────────────────────────────────────────────────
  //  2. Initial Data Fetch (API)
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchInfo().then((data) => {
      if (typeof data.lightOperationMode !== "undefined") setLightOperationMode(data.lightOperationMode);
      if (typeof data.lightManualState !== "undefined") setLightManualState(data.lightManualState);
      if (typeof data.setAcPower !== "undefined") setAcPowerState(data.setAcPower);
      if (typeof data.acIsDry !== "undefined") setAcIsDry(data.acIsDry);
      if (typeof data.acTemp !== "undefined") setAcTemp(Number(data.acTemp));
      if (typeof data.acTimerEnabled !== "undefined") setAcAutoMode(data.acTimerEnabled);
      if (typeof data.acIsCool !== "undefined") setAcIsCool(data.acIsCool);
      if (typeof data.acFan !== "undefined") setAcFan(data.acFan);
      if (typeof data.acStartHour !== "undefined") setAcStartTime(dayjs().hour(data.acStartHour).minute(data.acStartMinute));
      if (typeof data.acEndHour !== "undefined") setAcEndTime(dayjs().hour(data.acEndHour).minute(data.acEndMinute));
      if (typeof data.lightStartTimeHour !== "undefined") setStartTime(dayjs().hour(data.lightStartTimeHour).minute(data.lightStartTimeMinute));
      if (typeof data.lightEndTimeHour !== "undefined") setEndTime(dayjs().hour(data.lightEndTimeHour).minute(data.lightEndTimeMinute));
      if (typeof data.vegBrightness !== "undefined") setVegBrightnessState(data.vegBrightness);
      if (typeof data.bloomBrightness !== "undefined") setBloomBrightnessState(data.bloomBrightness);
      if (typeof data.uvBrightness !== "undefined") setUvBrightnessState(data.uvBrightness);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchInfoTen().then((data) => {
      if (typeof data.service_control_cam1 !== "undefined") setCameraState(data.service_control_cam1);
      if (typeof data.service_control_cam2 !== "undefined") setCameraState2(data.service_control_cam2);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchInfoCam1().then((data) => {
      if (typeof data.auto_focus_topview !== "undefined") setAutoFocusState(data.auto_focus_topview);
      if (typeof data.manual_focus_topview !== "undefined") setManualFocusModeTop(data.manual_focus_topview);
      if (typeof data.manual_focus_value_topview !== "undefined") setManualFocusValueTop(data.manual_focus_value_topview);
      if (typeof data.brightness_topview !== "undefined") setBrightnessTop(data.brightness_topview);
      if (typeof data.contrast_topview !== "undefined") setContrastTop(data.contrast_topview);
      if (typeof data.definition_topview !== "undefined") setDefinitionTop(data.definition_topview);
      if (typeof data.saturation_topview !== "undefined") setSaturationTop(data.saturation_topview);
      if (typeof data.zoom_topview !== "undefined") setZoomTop(data.zoom_topview);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchInfoCam2().then((data) => {
      if (typeof data.auto_focus_sideview !== "undefined") setAutoFocusState2(data.auto_focus_sideview);
      if (typeof data.manual_focus_sideview !== "undefined") setManualFocusMode(data.manual_focus_sideview);
      if (typeof data.manual_focus_value_sideview !== "undefined") setManualFocusValue(data.manual_focus_value_sideview);
      if (typeof data.brightness_sideview !== "undefined") setBrightnessSide(data.brightness_sideview);
      if (typeof data.contrast_sideview !== "undefined") setContrastSide(data.contrast_sideview);
      if (typeof data.definition_sideview !== "undefined") setDefinitionSide(data.definition_sideview);
      if (typeof data.saturation_sideview !== "undefined") setSaturationSide(data.saturation_sideview);
      if (typeof data.zoom_sideview !== "undefined") setZoomSide(data.zoom_sideview);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchInfoDelta().then((data) => {
      if (typeof data.manualState !== "undefined") setManualState(data.manualState);
      if (typeof data.motorXState !== "undefined") setXPlus(data.motorXState);
      if (typeof data.motorXRevState !== "undefined") setXMinus(data.motorXRevState);
      if (typeof data.motorYState !== "undefined") setYPlus(data.motorYState);
      if (typeof data.motorYRevState !== "undefined") setYMinus(data.motorYRevState);
      if (typeof data.motorZState !== "undefined") setZPlus(data.motorZState);
      if (typeof data.motorZRevState !== "undefined") setZMinus(data.motorZRevState);
      if (typeof data.isRunning !== "undefined") setIsMoving(data.isRunning);
      if (typeof data.currentStatus !== "undefined") setCurrentStatus(data.currentStatus);
      if (data.currentStatus === "Emergency STOP") setIsEmergency(true);
      if (data.currentStatus === "ALARM CLEAR") setIsEmergency(false);
    }).catch(console.error);
  }, []);

  // ─────────────────────────────────────────────────────────────
  //  3. Handler Helpers
  // ─────────────────────────────────────────────────────────────

  /** Generic toggle handler: ห่อ setState + API call + rollback */
  const handleToggle = async (
    apiFn: (v: boolean) => Promise<void>,
    checked: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    label?: string
  ) => {
    setLoading(true);
    setState(checked);
    try {
      await apiFn(checked);
      message.success(`${label ?? ""}: ${checked ? "ON" : "OFF"}`);
    } catch {
      setState(!checked);
      message.error(`Failed: ${label}`);
    } finally {
      setLoading(false);
    }
  };

  /** Generic pulse command handler */
  const handlePulse = async (
    apiFn: () => Promise<void>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    successMsg: string,
    lockMoving = true
  ) => {
    setLoading(true);
    if (lockMoving) setIsMoving(true);
    try {
      await apiFn();
      message.success(successMsg);
    } catch {
      if (lockMoving) setIsMoving(false);
      message.error("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  4. Light Handlers
  // ─────────────────────────────────────────────────────────────

  const onToggleLight = (checked: boolean) =>
    handleToggle(toggleLight, checked, setLightManualState, setLightLoading, "Light");

  const onToggleLightMode = (checked: boolean) =>
    handleToggle(toggleLightAutoMode, checked, setLightOperationMode, setLightOperationModeLoading, "Auto Mode");

  const handleSaveSchedule = async () => {
    if (!startTime || !endTime) { message.warning("กรุณาเลือกเวลาให้ครบ"); return; }
    setScheduleLoading(true);
    try {
      await saveLightSchedule(startTime.hour(), startTime.minute(), endTime.hour(), endTime.minute());
      message.success("บันทึกเวลาทำงานสำเร็จ!");
    } catch { message.error("บันทึกไม่สำเร็จ"); }
    finally { setScheduleLoading(false); }
  };

  const handleLightChange = async (type: "veg" | "bloom" | "uv", newValue: number | null) => {
    if (newValue === null || newValue < 0 || newValue > 100) return;
    const map = {
      veg: { apiFn: setVegBrightness, setState: setVegBrightnessState, oldValue: vegBrightness },
      bloom: { apiFn: setBloomBrightness, setState: setBloomBrightnessState, oldValue: bloomBrightness },
      uv: { apiFn: setUvBrightness, setState: setUvBrightnessState, oldValue: uvBrightness },
    };
    const { apiFn, setState, oldValue } = map[type];
    setState(newValue);
    try { await apiFn(newValue); }
    catch { setState(oldValue); message.error(`บันทึกค่า ${type} ไม่สำเร็จ`); }
  };

  // ─────────────────────────────────────────────────────────────
  //  5. Air Conditioner Handlers
  // ─────────────────────────────────────────────────────────────

  const onToggleAirCon = (checked: boolean) =>
    handleToggle(toggleAirCon, checked, setAcPowerState, setAcLoading, "Air Conditioner");

  const onToggleAirCoolMode = (checked: boolean) =>
    handleToggle(toggleAcCoolMode, checked, setAcIsCool, setAcIsCoolLoading, "Cool Mode");

  const onToggleAirMode = (checked: boolean) =>
    handleToggle(toggleAcDryMode, checked, setAcIsDry, setAcIsDryLoading, "AC Mode");

  const onToggleAirFanSpeed = (checked: boolean) =>
    handleToggle(toggleAcFanSpeed, checked, setAcFan, setAcFanLoading, "Fan Speed");

  const onToggleAirAutoMode = (checked: boolean) =>
    handleToggle(toggleAcAutoMode, checked, setAcAutoMode, setAcAutoLoading, "AC Auto Mode");

  const adjustTemp = async (change: number) => {
    const newTemp = acTemp + change;
    if (newTemp < 18 || newTemp > 30) { message.warning("อุณหภูมิต้องอยู่ระหว่าง 18 - 30 องศา"); return; }
    setAcTemp(newTemp);
    setAcTempLoading(true);
    try {
      await setAcTemperature(newTemp);
      message.success(`ปรับอุณหภูมิเป็น ${newTemp}°C`);
    } catch { setAcTemp(acTemp); message.error("บันทึกอุณหภูมิไม่สำเร็จ"); }
    finally { setAcTempLoading(false); }
  };

  const handleSaveAcSchedule = async () => {
    if (!acStartTime || !acEndTime) { message.warning("กรุณาระบุเวลาแอร์ให้ครบ"); return; }
    setAcScheduleLoading(true);
    try {
      await saveAcSchedule(acStartTime.hour(), acStartTime.minute(), acEndTime.hour(), acEndTime.minute());
      message.success("บันทึกเวลาแอร์สำเร็จ!");
    } catch { message.error("บันทึกเวลาไม่สำเร็จ"); }
    finally { setAcScheduleLoading(false); }
  };

  // ─────────────────────────────────────────────────────────────
  //  6. Camera Handlers
  // ─────────────────────────────────────────────────────────────

  const onToggleCamera1 = (checked: boolean) =>
    handleToggle(toggleCamera1, checked, setCameraState, setCameraLoading, "Camera 1");

  const onToggleCamera2 = (checked: boolean) =>
    handleToggle(toggleCamera2, checked, setCameraState2, setCameraLoading2, "Camera 2");

  const onToggleAutoFocus = (checked: boolean) =>
    handleToggle(toggleAutoFocusCam1, checked, setAutoFocusState, setAutoFocusLoading, "Auto Focus 1");

  const onToggleAutoFocus2 = (checked: boolean) =>
    handleToggle(toggleAutoFocusCam2, checked, setAutoFocusState2, setAutoFocusLoading2, "Auto Focus 2");

  const onToggleManualFocusTop = (checked: boolean) =>
    handleToggle(toggleManualFocusCam1, checked, setManualFocusModeTop, setManualFocusLoadingTop, "Manual Focus 1");

  const onToggleManualFocus = (checked: boolean) =>
    handleToggle(toggleManualFocusCam2, checked, setManualFocusMode, setManualFocusLoading, "Manual Focus 2");

  const onCaptureImage = async () => {
    if (!cameraState) return;
    try {
      await captureImageCam1("rtsp://191.20.110.189:8554/cam_topview");
      message.success("Camera picture source set");
    } catch { message.error("Failed to set camera picture"); }
  };

  const sendManualFocusValueTop = async (value: number) => {
    setManualFocusSendLoadingTop(true);
    try { await setManualFocusValueCam1(value); message.success(`Focus set to ${value}`); }
    catch { message.error("Failed to set focus"); }
    finally { setManualFocusSendLoadingTop(false); }
  };

  const sendManualFocusValue = async (value: number) => {
    setManualFocusSendLoading(true);
    try { await setManualFocusValueCam2(value); message.success(`Focus set to ${value}`); }
    catch { message.error("Failed to set focus"); }
    finally { setManualFocusSendLoading(false); }
  };

  const handleSaveCameraSettingTop = async () => {
    try {
      await saveCameraSettingsCam1({ brightness: brightnessTop, contrast: contrastTop, definition: definitionTop, saturation: saturationTop, zoom: zoomTop });
      message.success("Camera settings applied");
    } catch { message.error("Failed to apply camera settings"); }
  };

  const handleSaveCameraSettingSide = async () => {
    try {
      await saveCameraSettingsCam2({ brightness: brightnessSide, contrast: contrastSide, definition: definitionSide, saturation: saturationSide, zoom: zoomSide });
      message.success("Camera settings applied");
    } catch { message.error("Failed to apply camera settings"); }
  };

  // ─────────────────────────────────────────────────────────────
  //  7. Robot / Motor Handlers
  // ─────────────────────────────────────────────────────────────

  const onToggleManualState = (checked: boolean) =>
    handleToggle(toggleManualMode, checked, setManualState, setManualLoading, "Manual Mode");

  const handleMoveLocation = async (key: MoveKey) => {
    setMoveLoading(true);
    setIsMoving(true);
    try {
      await sendMoveLocation(key);
      message.success(`ส่งคำสั่ง ${key} แล้ว`);
    } catch { setIsMoving(false); message.error("Connection Error"); }
    finally { setMoveLoading(false); }
  };

  const handleMoveGripper = async (key: string) => {
    setMoveLoading(true);
    setIsMoving(true);
    try {
      await sendPulseCommand(key, 2000);
      message.success(`ส่งคำสั่ง ${key} แล้ว`);
    } catch { setIsMoving(false); message.error("Connection Error"); }
    finally { setMoveLoading(false); }
  };

  const handleMoveSoil = () => handlePulse(moveSoil, setMoveLoading, "moveSoil!");
  const handleMoveWater = () => handlePulse(moveWatering, setMoveLoading, "moveWatering!");
  const handleMoveHome = () => handlePulse(moveHome, setMoveLoading, "Returning to Home Position!");
  const handleClearAlarm = () => handlePulse(clearAlarm, setClearAlarmLoading, "ClearAlarm!", false);
  const handleStop = () => handlePulse(emergencyStop, setStopLoading, "Emergency Stop!!!", false);

  const handleJogPlus = async (
    apiFn: (v: boolean) => Promise<void>,
    setPlus: React.Dispatch<React.SetStateAction<boolean>>,
    setMinus: React.Dispatch<React.SetStateAction<boolean>>,
    minusFn: (v: boolean) => Promise<void>,
    currentPlus: boolean
  ) => {
    const next = !currentPlus;
    setPlus(next);
    await apiFn(next);
    if (next) { setMinus(false); await minusFn(false); }
  };

  const handleJogMinus = async (
    apiFn: (v: boolean) => Promise<void>,
    setMinus: React.Dispatch<React.SetStateAction<boolean>>,
    setPlus: React.Dispatch<React.SetStateAction<boolean>>,
    plusFn: (v: boolean) => Promise<void>,
    currentMinus: boolean
  ) => {
    const next = !currentMinus;
    setMinus(next);
    await apiFn(next);
    if (next) { setPlus(false); await plusFn(false); }
  };

  // ─────────────────────────────────────────────────────────────
  //  8. Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ marginBottom: 30 }}>
        <Title level={2}>Smart Farm Control</Title>
        <Text type="secondary">
          <WifiOutlined style={{ color: isConnected ? "#52c41a" : "#ff4d4f" }} /> Server Status
        </Text>
      </div>

      {/* ── Light Settings ─────────────────────────────────────── */}
      <Title level={4} style={{ textAlign: "left", marginTop: 30, marginBottom: 20, color: "#666" }}>Light Settings</Title>
      <Row gutter={[24, 24]} style={{ alignItems: "stretch" }}>
        {/* Grow Light */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, minHeight: 200 }}>
            <div style={{ marginBottom: 20 }}>
              <BulbOutlined style={{ fontSize: 40, color: "#faad14", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Grow Light</Title>
              <div style={{ height: 24, marginTop: 5 }}>
                {lightOperationMode
                  ? <Tag icon={<RobotOutlined />} color="processing">Auto Mode Active</Tag>
                  : <Text type="secondary">{lightManualState ? "ON" : "OFF"}</Text>}
              </div>
            </div>
            <Switch
              checked={lightManualState}
              disabled={lightOperationMode}
              onChange={onToggleLight}
              loading={lightLoading}
              checkedChildren={<PoweroffOutlined />}
              unCheckedChildren={<PoweroffOutlined />}
              style={{ transform: "scale(1.5)", backgroundColor: lightManualState ? "#faad14" : undefined, opacity: lightOperationMode ? 0.5 : 1 }}
            />
          </Card>
        </Col>

        {/* Light Auto Mode */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, minHeight: 200 }}>
            <div style={{ marginBottom: 20 }}>
              <RobotOutlined style={{ fontSize: 40, color: "#722ed1", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Light Auto Mode</Title>
              <Text type="secondary">{lightOperationMode ? "Enabled" : "Disabled"}</Text>
            </div>
            <Switch
              checked={lightOperationMode}
              onChange={onToggleLightMode}
              loading={lightOperationModeLoading}
              checkedChildren="ON" unCheckedChildren="OFF"
              style={{ transform: "scale(1.5)", backgroundColor: lightOperationMode ? "#722ed1" : undefined }}
            />
          </Card>
        </Col>

        {/* Light Timer */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, minHeight: 200 }}>
            <div style={{ marginBottom: 15, borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: "#722ed1", marginRight: 10 }} />
              <Text strong style={{ fontSize: 16 }}>Light Timer</Text>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <TimePicker format="HH:mm" placeholder="Start" value={startTime} onChange={setStartTime} style={{ width: 100 }} disabled={lightOperationMode} />
                <span>-</span>
                <TimePicker format="HH:mm" placeholder="End" value={endTime} onChange={setEndTime} style={{ width: 100 }} disabled={lightOperationMode} />
              </div>
              <Button type="primary" shape="round" icon={<ClockCircleOutlined />} onClick={handleSaveSchedule}
                loading={scheduleLoading} disabled={!startTime || !endTime || lightOperationMode}
                style={{ width: "100%", maxWidth: 200, backgroundColor: "#722ed1", borderColor: "#722ed1" }}>
                Save Schedule
              </Button>
            </div>
          </Card>
        </Col>

        {/* LED Control */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <BulbOutlined style={{ fontSize: 40, color: "#faad14", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Light Control</Title>
              <div style={{ height: 24, marginBottom: 10 }}>
                {isEmergency
                  ? <Tag icon={<AlertOutlined />} color="error">EMERGENCY STOP</Tag>
                  : <Text type="secondary">ปรับค่าความสว่าง</Text>}
              </div>
            </div>
            {[
              { type: "veg" as const, label: "Veg (White)", color: "#faad14", value: vegBrightness },
              { type: "bloom" as const, label: "Bloom (Red)", color: "#ff4d4f", value: bloomBrightness },
              { type: "uv" as const, label: "UV (Purple)", color: "#722ed1", value: uvBrightness },
            ].map(({ type, label, color, value }) => (
              <div key={type} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <Text strong><span style={{ color }}>●</span> {label}</Text>
                  <Tag>Max 100</Tag>
                </div>
                <Row gutter={12} align="middle">
                  <Col span={18}>
                    <Slider min={0} max={100} disabled={isEmergency || manualState} value={value}
                      onChange={(val) => handleLightChange(type, val)}
                      trackStyle={{ backgroundColor: color }} handleStyle={{ borderColor: color, backgroundColor: color }}
                      tooltip={{ formatter: (v) => `${v}%` }} />
                  </Col>
                  <Col span={6}>
                    <InputNumber min={0} max={100} value={value}
                      onChange={(val) => handleLightChange(type, val)}
                      disabled={isEmergency || manualState}
                      style={{ width: "100%", color, fontWeight: "bold" }}
                      formatter={(v) => `${v}%`} />
                  </Col>
                </Row>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* ── Air Condition Settings ─────────────────────────────── */}
      <Title level={4} style={{ textAlign: "left", marginTop: 30, marginBottom: 20, color: "#666" }}>Air Condition Settings</Title>
      <Row gutter={[24, 24]} style={{ alignItems: "stretch" }}>
        {/* AC Power */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color="#1677ff" strokeWidth={1.8} />
              <Title level={4} style={{ margin: 0 }}>Air Conditioner</Title>
              <Text type="secondary">{acPowerState ? "OPEN" : "CLOSED"}</Text>
            </div>
            <Switch checked={acPowerState} onChange={onToggleAirCon} loading={acLoading}
              checkedChildren={<PoweroffOutlined />} unCheckedChildren={<PoweroffOutlined />}
              style={{ transform: "scale(1.5)", backgroundColor: acPowerState ? "#52c41a" : undefined }} />
          </Card>
        </Col>

        {/* Temperature */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <CloudOutlined style={{ fontSize: 40, color: "#36cfc9", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Temperature</Title>
              <Text type="secondary">ปรับอุณหภูมิ</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <Button shape="circle" size="large" icon={<MinusOutlined />} onClick={() => adjustTemp(-1)} disabled={acTempLoading} />
              <Title level={2} style={{ margin: 0, color: "#36cfc9" }}>{acTemp}°C</Title>
              <Button shape="circle" size="large" icon={<PlusOutlined />} onClick={() => adjustTemp(1)} disabled={acTempLoading} />
            </div>
          </Card>
        </Col>

        {/* Cool Mode */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color="#1677ff" strokeWidth={1.8} />
              <Title level={4} style={{ margin: 0 }}>Cool Mode</Title>
              <Text type="secondary">{acIsCool ? "COOL ON" : "COOL OFF"}</Text>
            </div>
            <Switch checked={acIsCool} onChange={onToggleAirCoolMode} loading={acIsCoolLoad}
              checkedChildren={<PoweroffOutlined />} unCheckedChildren={<PoweroffOutlined />}
              style={{ transform: "scale(1.5)", backgroundColor: acIsCool ? "#52c41a" : undefined }} />
          </Card>
        </Col>

        {/* AC Mode */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color={acIsDry ? "#1677ff" : "#52c41a"} strokeWidth={1.8} style={{ marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>AC Mode</Title>
              <Text strong style={{ color: acIsDry ? "#1677ff" : "#52c41a", fontSize: 16 }}>
                {acIsDry ? "DRY MODE" : "FAN MODE"}
              </Text>
            </div>
            <Switch checked={acIsDry} onChange={onToggleAirMode} loading={acIsDryLoad}
              checkedChildren="DRY" unCheckedChildren="FAN" disabled={acIsCool}
              style={{ transform: "scale(1.5)", backgroundColor: acIsDry ? "#1677ff" : "#52c41a" }} />
          </Card>
        </Col>

        {/* Fan Speed */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <Fan size={40} color={acFan ? "#1677ff" : "#52c41a"} strokeWidth={1.8} style={{ marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Fan Speed</Title>
              <Text strong style={{ color: acFan ? "#1677ff" : "#52c41a", fontSize: 16 }}>
                {acFan ? "STRONG SPEED" : "CALM SPEED"}
              </Text>
            </div>
            <Switch checked={acFan} onChange={onToggleAirFanSpeed} loading={acFanLoad}
              checkedChildren="STRONG" unCheckedChildren="CALM"
              style={{ transform: "scale(1.5)", backgroundColor: acFan ? "#1677ff" : "#52c41a" }} />
          </Card>
        </Col>

        {/* Air Auto Schedule */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Snowflake size={24} color="#36cfc9" style={{ marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>Air Auto Mode</Title>
              </div>
              <Switch checked={acAutoMode} onChange={onToggleAirAutoMode} loading={acAutoLoading}
                checkedChildren="ON" unCheckedChildren="OFF"
                style={{ backgroundColor: acAutoMode ? "#36cfc9" : undefined }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 5, alignItems: "center" }}>
                <TimePicker format="HH:mm" placeholder="Start" value={acStartTime} onChange={setAcStartTime} disabled={acAutoMode} style={{ width: 90 }} />
                <span>-</span>
                <TimePicker format="HH:mm" placeholder="End" value={acEndTime} onChange={setAcEndTime} disabled={acAutoMode} style={{ width: 90 }} />
              </div>
              <Button type="primary" icon={<ClockCircleOutlined />} onClick={handleSaveAcSchedule}
                loading={acScheduleLoading} disabled={acAutoMode}
                style={{ backgroundColor: "#36cfc9", borderColor: "#36cfc9", width: "100%" }}>
                Save
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Camera Control ─────────────────────────────────────── */}
      <Title level={4} style={{ textAlign: "left", marginTop: 30, marginBottom: 20, color: "#666" }}>Camera Control</Title>
      <Row gutter={[24, 24]} style={{ alignItems: "stretch" }}>
        {/* Camera 1 Control */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <VideoCameraOutlined style={{ fontSize: 40, color: "#ff4d4f", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>CCTV Camera 1</Title>
              <Text type="secondary">{cameraState ? "Active" : "Offline"}</Text>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <Switch checked={cameraState} onChange={onToggleCamera1} loading={cameraLoading}
                checkedChildren="ON" unCheckedChildren="OFF"
                style={{ transform: "scale(1.5)", backgroundColor: cameraState ? "#ff4d4f" : undefined }} />
              <Button type="primary" icon={<CameraOutlined />} onClick={onCaptureImage}
                loading={captureLoading} disabled={!cameraState}
                style={{ backgroundColor: cameraState ? "#6e6e6e" : "#d9d9d9", borderColor: cameraState ? "#ff4d4f" : "#d9d9d9", minWidth: 120 }}>
                Capture
              </Button>
            </div>
          </Card>
        </Col>

        {/* Camera 1 Feed */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%", overflow: "hidden", padding: 0, backgroundColor: "#000" }}
            bodyStyle={{ padding: 0, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <iframe src="http://191.20.110.189:8889/cam_topview" style={{ width: "100%", height: "100%", border: "none", minHeight: 180 }} title="CCTV Feed 1" />
          </Card>
        </Col>

        {/* Camera 2 Control */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <VideoCameraOutlined style={{ fontSize: 40, color: "#ff4d4f", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>CCTV Camera 2</Title>
              <Text type="secondary">{cameraState2 ? "Active" : "Offline"}</Text>
            </div>
            <Switch checked={cameraState2} onChange={onToggleCamera2} loading={cameraLoading2}
              checkedChildren="ON" unCheckedChildren="OFF"
              style={{ transform: "scale(1.5)", backgroundColor: cameraState2 ? "#ff4d4f" : undefined }} />
          </Card>
        </Col>

        {/* Camera 2 Feed */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%", overflow: "hidden", padding: 0, backgroundColor: "#000" }}
            bodyStyle={{ padding: 0, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <iframe src="http://191.20.110.189:8889/cam_sideview" style={{ width: "100%", height: "100%", border: "none", minHeight: 180 }} title="CCTV Feed 2" />
          </Card>
        </Col>

        {/* Auto Focus 1 */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <AimOutlined style={{ fontSize: 40, color: "#722ed1", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Auto Focus Camera 1</Title>
              <Text type="secondary">{autoFocusState ? "ON" : "OFF"}</Text>
            </div>
            <Switch checked={autoFocusState} onChange={onToggleAutoFocus} loading={autoFocusLoading}
              checkedChildren="ON" unCheckedChildren="OFF" disabled={!cameraState}
              style={{ transform: "scale(1.5)", backgroundColor: !cameraState ? undefined : autoFocusState ? "#722ed1" : undefined }} />
          </Card>
        </Col>

        {/* Manual Focus 1 */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Focus size={24} color="#9254de" style={{ marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>Manual Focus Camera 1</Title>
              </div>
              <Switch checked={manualFocusModeTop} onChange={onToggleManualFocusTop} loading={manualFocusLoadingTop}
                checkedChildren="ON" unCheckedChildren="OFF" disabled={!cameraState}
                style={{ backgroundColor: manualFocusModeTop ? "#9254de" : undefined }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ textAlign: "center", fontWeight: 600 }}>Focus Level: {manualFocusValueTop}</div>
              <Slider min={0} max={100} value={manualFocusValueTop} onChange={setManualFocusValueTop}
                onAfterChange={sendManualFocusValueTop} disabled={!manualFocusModeTop} />
              {manualFocusSendLoadingTop && <div style={{ textAlign: "center", fontSize: 12, color: "#999" }}>Sending focus value...</div>}
            </div>
          </Card>
        </Col>

        {/* Auto Focus 2 */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <AimOutlined style={{ fontSize: 40, color: "#722ed1", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Auto Focus Camera 2</Title>
              <Text type="secondary">{autoFocusState2 ? "ON" : "OFF"}</Text>
            </div>
            <Switch checked={autoFocusState2} onChange={onToggleAutoFocus2} loading={autoFocusLoading2}
              checkedChildren="ON" unCheckedChildren="OFF" disabled={!cameraState2}
              style={{ transform: "scale(1.5)", backgroundColor: !cameraState2 ? undefined : autoFocusState2 ? "#722ed1" : undefined }} />
          </Card>
        </Col>

        {/* Manual Focus 2 */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15, borderBottom: "1px solid #f0f0f0", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Focus size={24} color="#9254de" style={{ marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>Manual Focus Camera 2</Title>
              </div>
              <Switch checked={manualFocusMode} onChange={onToggleManualFocus} loading={manualFocusLoading}
                checkedChildren="ON" unCheckedChildren="OFF" disabled={!cameraState2}
                style={{ backgroundColor: manualFocusMode ? "#9254de" : undefined }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ textAlign: "center", fontWeight: 600 }}>Focus Level: {manualFocusValue}</div>
              <Slider min={0} max={100} value={manualFocusValue} onChange={setManualFocusValue}
                onAfterChange={sendManualFocusValue} disabled={!manualFocusMode} />
              {manualFocusSendLoading && <div style={{ textAlign: "center", fontSize: 12, color: "#999" }}>Sending focus value...</div>}
            </div>
          </Card>
        </Col>

        {/* Camera Settings Top */}
        <Col xs={32} sm={24} md={12}>
          <Card hoverable style={{ borderRadius: 20, height: "100%" }}>
            <Title level={5} style={{ marginBottom: 16 }}>Camera Setting 1 (Top View)</Title>
            <Row gutter={[12, 12]}>
              {[
                { label: "Brightness", value: brightnessTop, set: setBrightnessTop },
                { label: "Contrast", value: contrastTop, set: setContrastTop },
                { label: "Definition", value: definitionTop, set: setDefinitionTop },
                { label: "Saturation", value: saturationTop, set: setSaturationTop },
                { label: "Zoom", value: zoomTop, set: setZoomTop },
              ].map(({ label, value, set }) => (
                <Col span={6} key={label}><Field label={`${label}_topview`} value={value} onChange={set} /></Col>
              ))}
            </Row>
            <Button type="primary" block style={{ marginTop: 20, backgroundColor: "#722ed1", borderColor: "#722ed1" }} onClick={handleSaveCameraSettingTop}>
              Apply Setting
            </Button>
          </Card>
        </Col>

        {/* Camera Settings Side */}
        <Col xs={32} sm={24} md={12}>
          <Card hoverable style={{ borderRadius: 20, height: "100%" }}>
            <Title level={5} style={{ marginBottom: 16 }}>Camera Setting 2 (Side View)</Title>
            <Row gutter={[12, 12]}>
              {[
                { label: "Brightness", value: brightnessSide, set: setBrightnessSide },
                { label: "Contrast", value: contrastSide, set: setContrastSide },
                { label: "Definition", value: definitionSide, set: setDefinitionSide },
                { label: "Saturation", value: saturationSide, set: setSaturationSide },
                { label: "Zoom", value: zoomSide, set: setZoomSide },
              ].map(({ label, value, set }) => (
                <Col span={6} key={label}><Field label={`${label}_sideview`} value={value} onChange={set} /></Col>
              ))}
            </Row>
            <Button type="primary" block style={{ marginTop: 20, backgroundColor: "#722ed1", borderColor: "#722ed1" }} onClick={handleSaveCameraSettingSide}>
              Apply
            </Button>
          </Card>
        </Col>
      </Row>

      {/* ── General Control ────────────────────────────────────── */}
      <Title level={4} style={{ textAlign: "left", marginTop: 30, marginBottom: 20, color: "#666" }}>General Control</Title>
      <Row gutter={[24, 24]} style={{ alignItems: "stretch" }}>
        {/* Manual Mode */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <ToolOutlined style={{ fontSize: 40, color: "#faad14", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Manual Mode</Title>
              <Text type="secondary">{manualState ? "Manual Only" : "Auto/Remote"}</Text>
            </div>
            <Switch disabled={isEmergency} checked={manualState} onChange={onToggleManualState} loading={manualLoading}
              checkedChildren="ON" unCheckedChildren="OFF"
              style={{ transform: "scale(1.5)", backgroundColor: manualState ? "#faad14" : undefined }} />
          </Card>
        </Col>

        {/* Jog Control */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable={!manualState} style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Manual Movement</Title>
              <Text type="secondary">Jog Control (X / Y / Z)</Text>
            </div>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {[
                { label: "X Axis", plus: xPlus, minus: xMinus, setPlus: setXPlus, setMinus: setXMinus, plusFn: setMotorX, minusFn: setMotorXRev },
                { label: "Y Axis", plus: yPlus, minus: yMinus, setPlus: setYPlus, setMinus: setYMinus, plusFn: setMotorY, minusFn: setMotorYRev },
                { label: "Z Axis", plus: zPlus, minus: zMinus, setPlus: setZPlus, setMinus: setZMinus, plusFn: setMotorZ, minusFn: setMotorZRev },
              ].map(({ label, plus, minus, setPlus, setMinus, plusFn, minusFn }) => (
                <Row key={label} justify="space-between" align="middle">
                  <Text strong>{label}</Text>
                  <Space>
                    <Button icon={<MinusOutlined />} danger type={minus ? "primary" : "default"}
                      disabled={isEmergency || !manualState || plus}
                      style={{ backgroundColor: minus ? "#ff4d4f" : undefined, borderColor: minus ? "#ff4d4f" : undefined, color: minus ? "#fff" : undefined }}
                      onClick={() => handleJogMinus(minusFn, setMinus, setPlus, plusFn, minus)} />
                    <Button icon={<PlusOutlined />} type={plus ? "primary" : "default"}
                      disabled={isEmergency || !manualState || minus}
                      style={{ backgroundColor: plus ? "#52c41a" : undefined, borderColor: plus ? "#52c41a" : undefined, color: plus ? "#fff" : undefined }}
                      onClick={() => handleJogPlus(plusFn, setPlus, setMinus, minusFn, plus)} />
                  </Space>
                </Row>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Device Movement */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <ArrowsAltOutlined style={{ fontSize: 40, color: "#eb2f96", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Device Movement</Title>
              <div style={{ height: 24 }}>
                {isEmergency ? <Tag icon={<AlertOutlined />} color="error">EMERGENCY STOP</Tag>
                  : isMoving ? <Tag icon={<SyncOutlined spin />} color="processing">MOVING...</Tag>
                    : <Text type="secondary">พร้อมทำงาน</Text>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Button type="primary" shape="round" size="large" icon={<PlayCircleOutlined />}
                onClick={handleMoveSoil} loading={moveLoading} disabled={isMoving || isEmergency || manualState}
                style={{ backgroundColor: (isMoving || isEmergency || manualState) ? undefined : "#eb2f96", borderColor: (isMoving || isEmergency || manualState) ? undefined : "#eb2f96", minWidth: 120 }}>
                {isMoving ? "Moving..." : "MOVE SOIL"}
              </Button>
              <Button type="primary" shape="round" size="large" icon={<PlayCircleOutlined />}
                onClick={handleMoveWater} loading={moveLoading} disabled={isMoving || isEmergency || manualState}
                style={{ backgroundColor: (isMoving || isEmergency || manualState) ? undefined : "#22cceeff", borderColor: (isMoving || isEmergency || manualState) ? undefined : "#22cceeff", minWidth: 120 }}>
                {isMoving ? "Moving..." : "MOVE WATER"}
              </Button>
            </div>
          </Card>
        </Col>

        {/* Emergency Stop */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%", borderColor: "#ff0004de", borderWidth: isEmergency ? 3 : 1, backgroundColor: isEmergency ? "#fff1f0" : undefined }}>
            <div style={{ marginBottom: 20 }}>
              <AlertOutlined style={{ fontSize: 40, color: "#ff0004de", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0, color: "#ff0004ff" }}>Emergency Stop</Title>
              <Text type="secondary">{isEmergency ? "STOPPED" : "System Running"}</Text>
            </div>
            <Button type="primary" danger shape="round" size="large" icon={<StopOutlined />}
              onClick={handleStop} loading={stopLoading} disabled={isEmergency}
              style={{ minWidth: 120, height: 45, fontSize: 16, fontWeight: "bold" }}>
              STOP
            </Button>
          </Card>
        </Col>

        {/* Clear Alarm */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <SafetyCertificateOutlined style={{ fontSize: 40, color: isEmergency ? "#fa8c16" : "#d9d9d9", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Clear Alarm</Title>
              <Text type="secondary">Reset Errors</Text>
            </div>
            <Button type="primary" shape="round" size="large" icon={<ClearOutlined />}
              onClick={handleClearAlarm} loading={clearAlarmLoading} disabled={!isEmergency}
              style={{ backgroundColor: isEmergency ? "#fa8c16" : undefined, borderColor: isEmergency ? "#fa8c16" : undefined, minWidth: 120 }}>
              CLEAR
            </Button>
          </Card>
        </Col>

        {/* Return Home */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <div style={{ marginBottom: 20 }}>
              <HomeOutlined style={{ fontSize: 40, color: "#13c2c2", marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Return Home</Title>
              {isEmergency ? <Text type="danger" strong>EMERGENCY STOP</Text> : <Text type="secondary">Back to Start</Text>}
            </div>
            <Button type="primary" shape="round" size="large" icon={<RollbackOutlined />}
              onClick={handleMoveHome} loading={homeLoading} disabled={isMoving || isEmergency}
              style={{ backgroundColor: (isMoving || isEmergency) ? undefined : "#13c2c2", borderColor: (isMoving || isEmergency) ? undefined : "#13c2c2", minWidth: 120 }}>
              HOME
            </Button>
          </Card>
        </Col>
      </Row>

      {/* ── General Move ───────────────────────────────────────── */}
      <Title level={4} style={{ textAlign: "left", marginTop: 30, marginBottom: 20, color: "#666" }}>General Move</Title>
      <Row gutter={[24, 24]} style={{ alignItems: "stretch" }}>
        <Col xs={48} sm={24} md={12}>
          <Card hoverable style={{ borderRadius: 15, height: "100%" }}>
            <Select<MoveMode> value={moveMode} onChange={setMoveMode} size="large"
              disabled={isMoving || isEmergency || manualState}
              style={{ width: 260, marginBottom: 16 }}
              options={[
                { label: "Move Location", value: "location" },
                { label: "Move Water", value: "water" },
                { label: "Move Soil", value: "soil" },
                { label: "Camera Top", value: "cameraTop" },
                { label: "Camera Side", value: "cameraSide" },
              ]} />
            <div style={{ marginBottom: 20 }}>
              <ArrowsAltOutlined style={{ fontSize: 40, color: "#eb2f96" }} />
              <Title level={3} style={{ margin: 0 }}>{MOVE_MODE_LABEL[moveMode]}</Title>
              <div style={{ height: 24 }}>
                {isEmergency ? <Tag icon={<AlertOutlined />} color="error">EMERGENCY STOP</Tag>
                  : isMoving ? <Tag icon={<SyncOutlined spin />} color="processing">{currentStatus}...</Tag>
                    : <Text>STATUS : {currentStatus}</Text>}
              </div>
            </div>

            {/* Gripper Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, width: "100%", marginBottom: 16 }}>
              {[
                { key: "moveGripperS", label: "Get Soil", color: "#87d068" },
                { key: "moveCorrectGripperS", label: "Return Soil", color: "#87d068" },
                { key: "moveGripperW", label: "Get Water", color: "#2db7f5" },
                { key: "moveCorrectGripperW", label: "Return Water", color: "#2db7f5" },
              ].map((item) => {
                const isReturnButton = item.key.includes("Correct");
                const noGripper = currentStatus === "No Gripper For Collection";
                const isDisabled = isMoving || isEmergency || manualState || (isReturnButton && noGripper);
                return (
                  <Button key={item.key} type="primary" shape="round" size="large" icon={<PlayCircleOutlined />}
                    disabled={isDisabled} onClick={() => handleMoveGripper(item.key)}
                    style={{ width: "100%", height: 45, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isDisabled ? undefined : item.color, borderColor: isDisabled ? undefined : item.color }}>
                    <span style={{ fontWeight: "bold" }}>{item.label}</span>
                  </Button>
                );
              })}
            </div>

            <div style={{ borderBottom: "1px solid #f0f0f0", marginBottom: 16 }} />

            {/* Move A–F Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%" }}>
              {activeMoveList.map(({ key, label }) => (
                <Button key={key} type="primary" shape="round" size="large" icon={<PlayCircleOutlined />}
                  disabled={isMoving || isEmergency || manualState}
                  onClick={() => handleMoveLocation(key)}
                  style={{
                    width: "100%", height: 45, display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: (isMoving || isEmergency || manualState) ? undefined : moveMode === "location" ? "#eb2f96" : "#1ba7ec",
                    borderColor: (isMoving || isEmergency || manualState) ? undefined : moveMode === "location" ? "#eb2f96" : "#1ba7ec",
                  }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                </Button>
              ))}
            </div>

            {/* Bottom Action Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 20, width: "100%" }}>
              <Button type="primary" danger shape="round" size="large" icon={<StopOutlined />}
                loading={stopLoading} onClick={handleStop} disabled={isEmergency}
                style={{ flex: 1, height: 45, fontWeight: "bold" }}>
                Emergency Stop
              </Button>
              <Button type="primary" shape="round" size="large" icon={<ClearOutlined />}
                onClick={handleClearAlarm} loading={clearAlarmLoading} disabled={!isEmergency}
                style={{ flex: 1, height: 45, fontWeight: "bold", backgroundColor: isEmergency ? "#fa8c16" : undefined, borderColor: isEmergency ? "#fa8c16" : undefined }}>
                Clear Alarm
              </Button>
              <Button type="primary" shape="round" size="large" icon={<HomeOutlined />}
                onClick={handleMoveHome} loading={homeLoading} disabled={isMoving || isEmergency}
                style={{ flex: 1, height: 45, fontWeight: "bold" }}>
                Home
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Live Stream ────────────────────────────────────────── */}
      <Row gutter={[24, 24]} style={{ alignItems: "stretch", marginTop: 24 }}>
        <Col xs={96} sm={48} md={24}>
          <Card hoverable style={{ borderRadius: 15, height: "150%", overflow: "hidden", padding: 0 }}
            bodyStyle={{ padding: 0, height: "100%" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}>
              <Title level={4} style={{ margin: 0 }}>
                <VideoCameraOutlined /> Live Stream / Monitoring
              </Title>
            </div>
            <div style={{ width: "100%", height: "calc(100% - 55px)", minHeight: 400 }}>
              <iframe src="http://191.20.208.7:5010/" title="Robot Monitoring"
                style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}