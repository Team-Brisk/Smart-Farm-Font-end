import React, { useState, useEffect } from "react";
import { Switch, Card, message, Typography, Spin, Row, Col, Tag, TimePicker, Button, Space } from "antd";
import {
  PoweroffOutlined, WifiOutlined, BulbOutlined, CloudOutlined, RobotOutlined, ClockCircleOutlined, StopOutlined
  , PlayCircleOutlined, SyncOutlined, ArrowsAltOutlined, MinusOutlined, PlusOutlined, VideoCameraOutlined,
  EyeInvisibleOutlined, AlertOutlined, RollbackOutlined, SafetyCertificateOutlined, // ✅ ไอคอนหัวข้อ
  ClearOutlined, // ✅ ไอคอนปุ่ม
  HomeOutlined, AimOutlined,ToolOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined
} from "@ant-design/icons";
import io from 'socket.io-client';
import dayjs from "dayjs";
import { ThunderboltOutlined } from "@ant-design/icons";
import { Snowflake } from "lucide-react";
interface MqttPayload {
  topic: string;
  message: any;
}

const { Title, Text } = Typography;
const socket = io("http://localhost:5000");

export default function SmartFarmControl() {
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
      if (typeof msg.acPowerState !== 'undefined') {
        console.log("⚡ Mode Changed (Socket):", msg.acPowerState);
        setacPowerState(msg.acPowerState);
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
      // check potision 
      // if (msg.currentStatus === 'Motion complete moveCorrectGripperS') {
      //   console.log("✅ งานเสร็จสิ้น! ปลดล็อคปุ่ม");
      //   setIsMoving(false); // แค่ปลดล็อคปุ่ม (ค่า value: false เราส่งไปแล้วใน handleMoveCommand)
      // }
      //check status
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
      //  Manual State
      if (typeof msg.manualState !== 'undefined') {
         console.log("🛠 Manual Mode Changed:", msg.manualState);
         setManualState(msg.manualState);
      }
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
        const response = await fetch("http://localhost:5000/api/relay/info", {
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
          if (typeof data.acPowerState !== 'undefined') {
            setacPowerState(data.acPowerState);
          }
          // mode
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
        const response = await fetch("http://localhost:5000/api/relay/info/ten", {
          cache: "no-store"
        });

        if (response.ok) {
          const data = await response.json();
          console.log("ℹ️ Init Attributes (API):", data);
          //  Camera 
          if (typeof data.service_control_cam1 !== 'undefined') setCameraState(data.service_control_cam1);
          if (typeof data.service_control_cam2 !== 'undefined') setCameraState2(data.service_control_cam2);
          // auto focus
          if (typeof data.auto_focus_topview !== 'undefined') { setAutoFocusState(data.auto_focus_topview); }
           if (typeof data.auto_focus_sideview !== 'undefined') { setAutoFocusState2(data.auto_focus_sideview); }
        }
        
      } catch (error) {
        console.error("Fetch Info Error:", error);
      }


    };
    fetchAttributesTen();
  }, []);
    //..-------------------- fetchAttributeDelta  ..--------------------//
    useEffect(() => {
    const fetchAttributeDelta = async () => {
      try {
        // ดึงข้อมูลจาก API
        const response = await fetch("http://localhost:5000/api/relay/info/delta", {
          cache: "no-store"
        });

        if (response.ok) {
          const data = await response.json();
          console.log("ℹ️ Init Attributes (API):", data);
          //  Camera 
          if (typeof data.manualState !== 'undefined') setManualState(data.manualState);
        }
        
      } catch (error) {
        console.error("Fetch Info Error:", error);
      }


    };
    fetchAttributeDelta();
  }, []);
  // ====================== ฟังก์ชันสั่งงาน ======================
  //  ------------------(สั่งไป Home)-------------------
  const handleHomeCommand = async () => {
    setHomeLoading(true);
    try {
      // 1. ส่งคำสั่ง key="home", value=true
      await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "home", value: true })
      });
      message.success("Returning to Home Position...");

      // 2. Pulse: ส่ง false ตามไปใน 2 วินาที (เพื่อให้ระบบ Trigger ทำงาน)
      setTimeout(async () => {
        await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "home", value: false })
        });
      }, 2000);

    } catch (error) {
      console.error(error);
      message.error("Failed to send Home command");
    } finally {
      setHomeLoading(false);
    }
  };
  //  ------------------Clear Alarm---------------------
  const handleClearAlarm = async () => {
    setClearAlarmLoading(true);
    try {
      // 1. ส่งคำสั่ง ClearAlarm (Pulse)
      await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ClearAlarm", value: true })
      });


      await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "stop", value: false })
      });

      // 3. Pulse ClearAlarm กลับเป็น false (ตาม logic เดิม)
      setTimeout(async () => {
        await fetch("http://localhost:5000/api/relay/set-attribute", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "ClearAlarm", value: false })
        });
      }, 2000);

      message.success("✅ System Cleared & Reset");
      setIsEmergency(false); // อัปเดตหน้าจอทันที

    } catch (error) {
      console.error(error);
      message.error("Failed to Clear Alarm");
    } finally {
      setClearAlarmLoading(false);
    }
  };
  const togglePump = async (checked: boolean) => {
    setPumpLoading(true);
    setIsPumpOn(checked);
    try {
      const response = await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "SV", value: checked })
      });
    } catch {
      setIsPumpOn(!checked); message.error("Error");
    } finally { setPumpLoading(false); }
  };
  // on of air
  const toggleAir = async (checked: boolean) => {
    setacLoading(true);
    setacPowerState(checked);
    try {
      const response = await fetch("http://localhost:5000/api/relay/set-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "acPowerState", value: checked })
      });
    } catch {
      setacPowerState(!checked); message.error("Error");
    } finally { setacLoading(false); }
  };
  // cool mode
  const toggleAirCoolMode = async (checked: boolean) => {
    sacIsCoolLoading(true);
    setacIsCool(checked);
    try {
      const response = await fetch("http://localhost:5000/api/relay/set-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "acIsCool", value: checked })
      });
    } catch {
      setacIsCool(!checked); message.error("Error");
    } finally { sacIsCoolLoading(false); }
  };
  // con mode
  const toggleAirMode = async (checked: boolean) => {
    setacIsDryLoading(true);
    setaacIsDryl(checked);
    try {
      const response = await fetch("http://localhost:5000/api/relay/set-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "acIsDry", value: checked })
      });
    } catch {
      setacIsCool(!checked); message.error("Error");
    } finally { setacIsDryLoading(false); }
  };
  //  Toggle Air Auto Mode
  const toggleAirAutoMode = async (checked: boolean) => {
    setAcAutoLoading(true);
    setAcAutoMode(checked);
    try {
      // ต้องไปเพิ่ม API /api/relay/airMode ใน Backend หรือใช้ set-attribute ก็ได้
      // อันนี้สมมติใช้ set-attribute เพื่อความง่าย (key: acAutoMode)
      await fetch("http://localhost:5000/api/relay/set-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "acTimerEnabled", value: checked })
      });
      message.success(`Air Auto Mode: ${checked ? "ON" : "OFF"}`);
    } catch {
      setAcAutoMode(!checked);
      message.error("Failed to set Air Auto Mode");
    } finally {
      setAcAutoLoading(false);
    }
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
      await fetch("http://localhost:5000/api/relay/multiSet", {
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
      const response = await fetch("http://localhost:5000/api/relay/set-attribute", {
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
  
  // move -test
  const handleMoveCommand = async () => {
    setMoveLoading(true);
    setIsMoving(true); // 1. ล็อคปุ่มทันที

    try {
      const response = await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "moveSoil", value: true })
      });
      message.success("ส่งคำสั่งเริ่มทำงาน!");

      
      // ( ยิง true แล้วยิง false ตามไป เพื่อไม่ให้ค้าง)
      setTimeout(async () => {
        await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: false })
        });
        console.log("⏰ Auto-reset (Pulse) sent to Backend");
      }, 2000);

    } catch (error) {
      console.error(error);
      setIsMoving(false); // ถ้า Error ให้ปลดล็อคเลย
      message.error("Connection Error");
    } finally {
      setMoveLoading(false);
    }
  };
  const toggleLight = async (checked: boolean) => {
    setLightLoading(true);
    setLightManualState(checked); 

    try {
      // ✅ แก้ไข URL และเพิ่ม Body เพื่อส่งค่า
      await fetch("http://localhost:5000/api/relay/set-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       
        body: JSON.stringify({ key: "lightManualState", value: checked })
      });

      message.success(`หลอดไฟ: ${checked ? "เปิด" : "ปิด"}`);
    } catch (error) {
      console.error("Toggle Light Error:", error);
      setLightManualState(!checked); // ถ้าพัง ให้ดีดกลับค่าเดิม
      message.error("Error: ไม่สามารถสั่งงานหลอดไฟได้");
    } finally {
      setLightLoading(false);
    }
  };

  const toggleLightMode = async (checked: boolean) => {
    SetLightOperationModeLoading(true);
    setLightOperationMode(checked);
    try {
      // ✅ แก้ไข URL และเพิ่ม Body เพื่อส่งค่า
      await fetch("http://localhost:5000/api/relay/set-attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ส่งบอกว่าตัวแปรชื่อ "lightManualState" มีค่าเป็น true/false
        body: JSON.stringify({ key: "lightOperationMode", value: checked })
      });
    } catch {
      setLightOperationMode(!checked); message.error("Error");
    } finally { SetLightOperationModeLoading(false); }
  };
  //// toggleCamera 1
  const toggleCamera = async (checked: boolean) => {
    setCameraLoading(true);
    setCameraState(checked);
    try {
      await fetch("http://localhost:5000/api/relay/set-attribute/ten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "service_control_cam1", value: checked })
      });
      message.success(`Camera: ${checked ? "ON" : "OFF"}`);
    } catch {
      setCameraState(!checked);
      message.error("Failed to toggle Camera");
    } finally {
      setCameraLoading(false);
    }
  };
  //// toggleCamera 2
  const toggleCamera2 = async (checked: boolean) => {
    setCameraLoading2(true);
    setCameraState2(checked);
    try {
      await fetch("http://localhost:5000/api/relay/set-attribute/ten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "service_control_cam2", value: checked })
      });
      message.success(`Camera: ${checked ? "ON" : "OFF"}`);
    } catch {
      setCameraState2(!checked);
      message.error("Failed to toggle Camera");
    } finally {
      setCameraLoading2(false);
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

      // ✅ เปลี่ยน URL เป็น /light-schedule
      const response = await fetch("http://localhost:5000/api/relay/multiSet", {
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
    // ---------------- emergeny stop -------------------------//
  };
  const handleStopCommand = async () => {
    setStopLoading(true);
    // Optimistic Update: ให้หน้าจอแดงทันที
    setIsEmergency(true);
    try {
      // ส่งคำสั่ง stop: true (ค้างไว้ ไม่ต้องส่ง false ตาม)
      await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "stop", value: true })
      });
      message.error("⛔ EMERGENCY STOP ACTIVATED!");
    } catch (error) {
      console.error(error);
      setIsEmergency(false); // ถ้าพังให้ดีดกลับ
      message.error("Failed to send Stop command");
    } finally {
      setStopLoading(false);
    }
  };
  //-------------auto focus-------------------------//
  const toggleAutoFocus = async (checked: boolean) => {
    setAutoFocusLoading(true);
    setAutoFocusState(checked); // เปลี่ยนหน้าจอทันที
    try {
      // ยิงไปที่ /ten หรือ path ที่คุณใช้สำหรับกล้อง
      await fetch("http://localhost:5000/api/relay/set-attribute/cam1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "auto_focus_topview", value: checked })
      });
      message.success(`Auto Focus: ${checked ? "ON" : "OFF"}`);
    } catch {
      setAutoFocusState(!checked); // ถ้าพังให้ดีดกลับ
      message.error("Failed to toggle Auto Focus");
    } finally {
      setAutoFocusLoading(false);
    }
  };
  const toggleAutoFocus2 = async (checked: boolean) => {
    setAutoFocusLoading2(true);
    setAutoFocusState2(checked); 
    try {
      
      await fetch("http://localhost:5000/api/relay/set-attribute/cam2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "auto_focus_sideview", value: checked })
      });
      message.success(`Auto Focus: ${checked ? "ON" : "OFF"}`);
    } catch {
      setAutoFocusState2(!checked); // ถ้าพังให้ดีดกลับ
      message.error("Failed to toggle Auto Focus");
    } finally {
      setAutoFocusLoading2(false);
    }
  };
  //-------------- manual state ------------------------//
  // 3. สร้างฟังก์ชัน Toggle Manual Mode
  const toggleManual = async (checked: boolean) => {
    setManualLoading(true);
    setManualState(checked); // เปลี่ยนหน้าจอทันที
    try {
      await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "manualState", value: checked })
      });
      message.success(`Manual Mode: ${checked ? "ON" : "OFF"}`);
    } catch {
      setManualState(!checked);
      message.error("Failed to toggle Manual Mode");
    } finally {
      setManualLoading(false);
    }
  };
  //--------------jog X ---------------------------//
  const jogX = async (checked: boolean) => {
    setmotorXStateLoading(true);
    setmotorXState(checked); // เปลี่ยนหน้าจอทันที
    try {
      await fetch("http://localhost:5000/api/relay/set-attribute/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "motorXState", value: checked })
      });
      message.success(`jog Mode: ${checked ? "ON" : "OFF"}`);
    } catch {
      setmotorXState(!checked);
      message.error("Failed to toggle Manual Mode");
    } finally {
      setmotorXStateLoading(false);
    }
  };
  const isPumpInit = (isPumpOn === null);
  const isLightInit = (lightManualState === null);
  const isLightStatInit = (lightOperationMode === null);
  const isAirInit = (acPowerState === null);
  const isAcAutoInit = (acAutoMode === null);
  const isacIsCool = (acIsCool === null);
  const isacIsDry = (acIsDry == null)
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
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
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
                onChange={toggleLight}
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
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <RobotOutlined style={{ fontSize: 40, color: '#722ed1', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Light Auto Mode</Title>
              <Text type="secondary">{lightOperationMode ? "Enabled" : "Disabled"}</Text>
            </div>
            {isLightStatInit ? <Spin /> : (
              <Switch
                checked={lightOperationMode} onChange={toggleLightMode} loading={lightOperationModeLoading}
                checkedChildren="ON" unCheckedChildren="OFF"
                style={{ transform: 'scale(1.5)', backgroundColor: lightOperationMode ? '#722ed1' : undefined }}
              />
            )}
          </Card>
        </Col>

        {/* Light Timer */}
        <Col xs={24} sm={12} md={6} >
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
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
      </Row>
      {/* ✅✅✅ ROW 2: Air Control Details ✅✅✅ */}
      <Title level={4} style={{ textAlign: 'left', marginTop: 30, marginBottom: 20, color: '#666' }}>Air Condition Settings</Title>

      <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}> {/* ยืดความสูงให้เท่ากัน */}
        {/* CARD 2: แอร์ (ON/OFF) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color="#1677ff" strokeWidth={1.8} />
              <Title level={4} style={{ margin: 0 }}>Air Conditioner</Title>
              <Text type="secondary">{isAirInit ? "Loading..." : (acPowerState ? "OPEN" : "CLOSED")}</Text>
            </div>
            {isAirInit ? <Spin /> : (
              <Switch
                checked={acPowerState} onChange={toggleAir} loading={acLoading}
                checkedChildren={<PoweroffOutlined />} unCheckedChildren={<PoweroffOutlined />}
                style={{ transform: 'scale(1.5)', backgroundColor: acPowerState ? '#52c41a' : undefined }}
              />
            )}
          </Card>
        </Col>
        {/* Air Temp Control */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <CloudOutlined style={{ fontSize: 40, color: '#36cfc9', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>Temperature</Title>
              <Text type="secondary">ปรับอุณหภูมิห้อง</Text>
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
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color="#1677ff" strokeWidth={1.8} />
              <Title level={4} style={{ margin: 0 }}>Cool Mode</Title>
              <Text type="secondary">{isacIsCool ? "Loading..." : (acIsCool ? "COOL ON" : "COOL OFF")}</Text>
            </div>
            {isacIsCool ? <Spin /> : (
              <Switch
                checked={acIsCool} onChange={toggleAirCoolMode} loading={acIsCoolLoad}
                checkedChildren={<PoweroffOutlined />} unCheckedChildren={<PoweroffOutlined />}
                style={{ transform: 'scale(1.5)', backgroundColor: acIsCool ? '#52c41a' : undefined }}
              />
            )}
          </Card>
        </Col>

        {/* Air Mode (Fan/Dry) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Snowflake size={40} color={acIsDry ? "#1677ff" : "#52c41a"} strokeWidth={1.8} style={{ marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>AC Mode</Title>
              <Text strong style={{ color: acIsDry ? "#1677ff" : "#52c41a", fontSize: 16 }}>
                {acIsDryLoad ? "Loading..." : (acIsDry ? "DRY MODE" : "FAN MODE")}
              </Text>
            </div>
            {isacIsDry ? <Spin /> : (
              <Switch
                checked={acIsDry} onChange={toggleAirMode} loading={acIsDryLoad}
                checkedChildren="DRY" unCheckedChildren="FAN" disabled={acIsCool}
                style={{ transform: 'scale(1.5)', backgroundColor: acIsDry ? '#1677ff' : '#52c41a' }}
              />
            )}
          </Card>
        </Col>

        {/* Air Auto Schedule (Timer) */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Snowflake size={24} color="#36cfc9" style={{ marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>Air Auto Mode</Title>
              </div>
              <Switch
                checked={acAutoMode} onChange={toggleAirAutoMode} loading={acAutoLoading}
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
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <VideoCameraOutlined style={{ fontSize: 40, color: '#ff4d4f', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>CCTV Camera 1</Title>
              <Text type="secondary">{cameraState ? "Active" : "Offline"}</Text>
            </div>
            <Switch
              checked={cameraState}
              onChange={toggleCamera}
              loading={cameraLoading}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              style={{ transform: 'scale(1.5)', backgroundColor: cameraState ? '#ff4d4f' : undefined }}
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
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, height: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <VideoCameraOutlined style={{ fontSize: 40, color: '#ff4d4f', marginBottom: 10 }} />
              <Title level={4} style={{ margin: 0 }}>CCTV Camera 2</Title>
              <Text type="secondary">{cameraState2 ? "Active" : "Offline"}</Text>
            </div>
            <Switch
              checked={cameraState2}
              onChange={toggleCamera2}
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
              onChange={toggleAutoFocus}
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
              onChange={toggleAutoFocus2}
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
              checked={manualState}
              onChange={toggleManual}
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
              <Button    disabled={isMoving || isEmergency || manualState} 
                 danger icon={<MinusOutlined />} onClick={() => jogX} />
              <Button    disabled={isMoving || isEmergency || manualState} 
                 type="primary" icon={<PlusOutlined />} onClick={() => jogX} />
            </Space>
          </Row>

          {/* Y AXIS */}
          <Row justify="space-between" align="middle">
            <Text strong>Y Axis</Text>
            <Space>
              <Button    disabled={isMoving || isEmergency || manualState} 
                 danger icon={<MinusOutlined />} onClick={() => move('Y', '-')} />
              <Button    disabled={isMoving || isEmergency || manualState} 
                 type="primary" icon={<PlusOutlined />} onClick={() => move('Y', '+')} />
            </Space>
          </Row>

          {/* Z AXIS */}
          <Row justify="space-between" align="middle">
            <Text strong>Z Axis</Text>
            <Space>
              <Button   disabled={isMoving || isEmergency || manualState} 
                 danger icon={<MinusOutlined />} onClick={() => move('Z', '-')} />
              <Button    disabled={isMoving || isEmergency || manualState} 
                 type="primary" icon={<PlusOutlined />} onClick={() => move('Z', '+')} />
              
            </Space>
          </Row>

        </Space>

      </Card>
    </Col>
        {/* CARD 4: Move Device */}
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
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
                type="primary" shape="round" size="large" icon={<PlayCircleOutlined />}
                onClick={handleMoveCommand} loading={moveLoading}
               disabled={isMoving || isEmergency || manualState} 
                
                style={{
                
                  backgroundColor: (isMoving || isEmergency || manualState) ? undefined : '#eb2f96',
                  borderColor: (isMoving || isEmergency || manualState) ? undefined : '#eb2f96',
                  minWidth: 120
                }}
              >
                {isMoving ? "Moving..." : "MOVE SOIL"}
              </Button>
              {isMoving && (
                <Button danger shape="circle" size="large" icon={<StopOutlined />} disabled={moveLoading} />
              )}
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
              onClick={handleStopCommand}
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
              onClick={handleClearAlarm}
              loading={clearAlarmLoading}

              // 🔥🔥🔥 จุดสำคัญ: ปุ่มนี้จะกดได้ ก็ต่อเมื่อ isEmergency เป็น true เท่านั้น 🔥🔥🔥
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
              onClick={handleHomeCommand}
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
    </div>
  );
}