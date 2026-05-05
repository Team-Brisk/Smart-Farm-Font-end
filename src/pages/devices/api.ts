// ============================================================
//  api.ts  –  Smart Farm Control · Centralized API Layer
// ============================================================
//  Base URL (เปลี่ยนที่นี่ที่เดียวเพื่อ apply ทั้งโปรเจกต์)
// ============================================================

const BASE_URL = "http://localhost:5000/api/allRoutes";

// ============================================================
//  ประเภท (Types) ที่ใช้ร่วมกัน
// ============================================================

export type AttributeEndpoint =
  | "set-attribute"       // generic
  | "set-attribute/namo"  // light / air / LED
  | "set-attribute/delta" // robot delta / motor
  | "set-attribute/ten"   // camera service control
  | "set-attribute/cam1"  // camera 1 settings
  | "set-attribute/cam2"  // camera 2 settings
  | "set-attribute/multi"; // multi-key save (schedule)

export type InfoEndpoint =
  | "info"
  | "info/ten"
  | "info/cam1"
  | "info/cam2"
  | "info/delta";

// ============================================================
//  1. GET — ดึงข้อมูลเริ่มต้น (Initial Fetch)
// ============================================================

/**
 * ดึง attribute ทั่วไป (light, air, LED, schedule)
 * @endpoint GET /api/allRoutes/info
 */
export async function fetchInfo(): Promise<Record<string, any>> {
  const res = await fetch(`${BASE_URL}/info`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetchInfo failed");
  return res.json();
}

/**
 * ดึง attribute ของกล้อง (camera service control)
 * @endpoint GET /api/allRoutes/info/ten
 */
export async function fetchInfoTen(): Promise<Record<string, any>> {
  const res = await fetch(`${BASE_URL}/info/ten`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetchInfoTen failed");
  return res.json();
}

/**
 * ดึง attribute ของกล้อง 1 (top view)
 * @endpoint GET /api/allRoutes/info/cam1
 */
export async function fetchInfoCam1(): Promise<Record<string, any>> {
  const res = await fetch(`${BASE_URL}/info/cam1`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetchInfoCam1 failed");
  return res.json();
}

/**
 * ดึง attribute ของกล้อง 2 (side view)
 * @endpoint GET /api/allRoutes/info/cam2
 */
export async function fetchInfoCam2(): Promise<Record<string, any>> {
  const res = await fetch(`${BASE_URL}/info/cam2`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetchInfoCam2 failed");
  return res.json();
}

/**
 * ดึง attribute ของ delta robot (manual mode, motor, status)
 * @endpoint GET /api/allRoutes/info/delta
 */
export async function fetchInfoDelta(): Promise<Record<string, any>> {
  const res = await fetch(`${BASE_URL}/info/delta`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetchInfoDelta failed");
  return res.json();
}

// ============================================================
//  2. POST — ตั้งค่า attribute ตัวเดียว (Single Key)
// ============================================================

/**
 * ส่ง key/value ไปยัง endpoint ที่ระบุ
 * ใช้ได้กับทุก endpoint ที่รับ { key, value }
 *
 * @example
 * await setAttribute("set-attribute/namo", "lightManualState", true);
 */
export async function setAttribute(
  endpoint: AttributeEndpoint,
  key: string,
  value: boolean | number | string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error(`setAttribute failed [${endpoint}] ${key}=${value}`);
}

// ============================================================
//  3. POST — ตั้งค่าหลาย attribute พร้อมกัน (Multi Key)
// ============================================================

/**
 * ส่ง object ของ key/value หลายคู่พร้อมกัน (ใช้สำหรับ schedule)
 * @endpoint POST /api/allRoutes/set-attribute/multi
 *
 * @example
 * await setMultiAttributes({
 *   lightStartTimeHour: 6,
 *   lightStartTimeMinute: 0,
 *   lightEndTimeHour: 18,
 *   lightEndTimeMinute: 0,
 * });
 */
export async function setMultiAttributes(
  payload: Record<string, number | boolean | string>
): Promise<void> {
  const res = await fetch(`${BASE_URL}/set-attribute/multi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("setMultiAttributes failed");
}

// ============================================================
//  4. กลุ่ม API — Light / LED
// ============================================================

/** เปิด/ปิดไฟโดยตรง (manual) */
export const toggleLight = (value: boolean) =>
  setAttribute("set-attribute/namo", "lightManualState", value);

/** เปลี่ยน mode อัตโนมัติ/manual ของไฟ */
export const toggleLightAutoMode = (value: boolean) =>
  setAttribute("set-attribute/namo", "lightOperationMode", value);

/** บันทึก schedule เวลาเปิด-ปิดไฟ */
export const saveLightSchedule = (
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
) =>
  setMultiAttributes({
    lightStartTimeHour: startHour,
    lightStartTimeMinute: startMinute,
    lightEndTimeHour: endHour,
    lightEndTimeMinute: endMinute,
  });

/** ปรับความสว่าง LED แต่ละช่อง */
export const setVegBrightness = (value: number) =>
  setAttribute("set-attribute/namo", "vegBrightness", value);

export const setBloomBrightness = (value: number) =>
  setAttribute("set-attribute/namo", "bloomBrightness", value);

export const setUvBrightness = (value: number) =>
  setAttribute("set-attribute/namo", "uvBrightness", value);

// ============================================================
//  5. กลุ่ม API — Air Conditioner
// ============================================================

/** เปิด/ปิดแอร์ */
export const toggleAirCon = (value: boolean) =>
  setAttribute("set-attribute/namo", "setAcPower", value);

/** ปรับอุณหภูมิ */
export const setAcTemperature = (value: number) =>
  setAttribute("set-attribute/namo", "acTemp", value);

/** เปิด/ปิด Cool Mode */
export const toggleAcCoolMode = (value: boolean) =>
  setAttribute("set-attribute/namo", "acIsCool", value);

/** สลับ Fan/Dry Mode */
export const toggleAcDryMode = (value: boolean) =>
  setAttribute("set-attribute/namo", "acIsDry", value);

/** เปิด/ปิด Fan Speed (Strong / Calm) */
export const toggleAcFanSpeed = (value: boolean) =>
  setAttribute("set-attribute/namo", "acFan", value);

/** เปิด/ปิด Air Auto Timer */
export const toggleAcAutoMode = (value: boolean) =>
  setAttribute("set-attribute/namo", "acTimerEnabled", value);

/** บันทึก schedule เวลาเปิด-ปิดแอร์ */
export const saveAcSchedule = (
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
) =>
  setMultiAttributes({
    acStartHour: startHour,
    acStartMinute: startMinute,
    acEndHour: endHour,
    acEndMinute: endMinute,
  });

// ============================================================
//  6. กลุ่ม API — Camera Service
// ============================================================

/** เปิด/ปิดกล้อง 1 */
export const toggleCamera1 = (value: boolean) =>
  setAttribute("set-attribute/ten", "service_control_cam1", value);

/** เปิด/ปิดกล้อง 2 */
export const toggleCamera2 = (value: boolean) =>
  setAttribute("set-attribute/ten", "service_control_cam2", value);

// ============================================================
//  7. กลุ่ม API — Camera 1 (Top View) Settings
// ============================================================

/** เปิด/ปิด Auto Focus กล้อง 1 */
export const toggleAutoFocusCam1 = (value: boolean) =>
  setAttribute("set-attribute/cam1", "auto_focus_topview", value);

/** เปิด/ปิด Manual Focus กล้อง 1 */
export const toggleManualFocusCam1 = (value: boolean) =>
  setAttribute("set-attribute/cam1", "manual_focus_topview", value);

/** ส่งค่า Manual Focus กล้อง 1 */
export const setManualFocusValueCam1 = (value: number) =>
  setAttribute("set-attribute/cam1", "manual_focus_value_topview", value);

/** บันทึกการตั้งค่ากล้อง 1 (brightness, contrast, definition, saturation, zoom) */
export const saveCameraSettingsCam1 = (settings: {
  brightness: number;
  contrast: number;
  definition: number;
  saturation: number;
  zoom: number;
}) =>
  Promise.all([
    setAttribute("set-attribute/cam1", "brightness_topview", settings.brightness),
    setAttribute("set-attribute/cam1", "contrast_topview", settings.contrast),
    setAttribute("set-attribute/cam1", "definition_topview", settings.definition),
    setAttribute("set-attribute/cam1", "saturation_topview", settings.saturation),
    setAttribute("set-attribute/cam1", "zoom_topview", settings.zoom),
  ]);

/** ตั้งค่า source ภาพถ่าย (Capture) กล้อง 1 */
export const captureImageCam1 = (rtspUrl: string) =>
  setAttribute("set-attribute/cam1", "camera_picture_topview_A", rtspUrl);

// ============================================================
//  8. กลุ่ม API — Camera 2 (Side View) Settings
// ============================================================

/** เปิด/ปิด Auto Focus กล้อง 2 */
export const toggleAutoFocusCam2 = (value: boolean) =>
  setAttribute("set-attribute/cam2", "auto_focus_sideview", value);

/** เปิด/ปิด Manual Focus กล้อง 2 */
export const toggleManualFocusCam2 = (value: boolean) =>
  setAttribute("set-attribute/cam2", "manual_focus_sideview", value);

/** ส่งค่า Manual Focus กล้อง 2 */
export const setManualFocusValueCam2 = (value: number) =>
  setAttribute("set-attribute/cam2", "manual_focus_value_sideview", value);

/** บันทึกการตั้งค่ากล้อง 2 */
export const saveCameraSettingsCam2 = (settings: {
  brightness: number;
  contrast: number;
  definition: number;
  saturation: number;
  zoom: number;
}) =>
  Promise.all([
    setAttribute("set-attribute/cam2", "brightness_sideview", settings.brightness),
    setAttribute("set-attribute/cam2", "contrast_sideview", settings.contrast),
    setAttribute("set-attribute/cam2", "definition_sideview", settings.definition),
    setAttribute("set-attribute/cam2", "saturation_sideview", settings.saturation),
    setAttribute("set-attribute/cam2", "zoom_sideview", settings.zoom),
  ]);

// ============================================================
//  9. กลุ่ม API — Delta Robot / Motor Control
// ============================================================

/** เปิด/ปิด Manual Mode */
export const toggleManualMode = (value: boolean) =>
  setAttribute("set-attribute/delta", "manualState", value);

/** Jog motor แกน X (ไปข้างหน้า) */
export const setMotorX = (value: boolean) =>
  setAttribute("set-attribute/delta", "motorXState", value);

/** Jog motor แกน X (ถอยหลัง) */
export const setMotorXRev = (value: boolean) =>
  setAttribute("set-attribute/delta", "motorXRevState", value);

/** Jog motor แกน Y (ไปข้างหน้า) */
export const setMotorY = (value: boolean) =>
  setAttribute("set-attribute/delta", "motorYState", value);

/** Jog motor แกน Y (ถอยหลัง) */
export const setMotorYRev = (value: boolean) =>
  setAttribute("set-attribute/delta", "motorYRevState", value);

/** Jog motor แกน Z (ขึ้น) */
export const setMotorZ = (value: boolean) =>
  setAttribute("set-attribute/delta", "motorZState", value);

/** Jog motor แกน Z (ลง) */
export const setMotorZRev = (value: boolean) =>
  setAttribute("set-attribute/delta", "motorZRevState", value);

// ============================================================
//  10. กลุ่ม API — Move Commands (Pulse: true → false)
// ============================================================

/**
 * ส่งคำสั่ง "pulse" ไปยัง delta endpoint
 * ยิง true แล้ว reset เป็น false อัตโนมัติหลัง pulseDuration ms
 */
export async function sendPulseCommand(
  key: string,
  pulseDuration: number = 2000
): Promise<void> {
  await setAttribute("set-attribute/delta", key, true);

  setTimeout(async () => {
    try {
      await setAttribute("set-attribute/delta", key, false);
    } catch (err) {
      console.warn(`Pulse reset failed for [${key}]`, err);
    }
  }, pulseDuration);
}

/** เคลื่อนที่ไปตำแหน่งที่ระบุ (moveA – moveF และ variants) */
export const sendMoveLocation = (key: string) =>
  setAttribute("set-attribute/delta", key, true);

/** เคลื่อนที่ไปเก็บดิน */
export const moveSoil = () => sendPulseCommand("moveSoil");

/** เคลื่อนที่ไปรดน้ำ */
export const moveWatering = () => sendPulseCommand("moveWatering");

/** กลับบ้าน (Home Position) */
export const moveHome = () => sendPulseCommand("home");

/** Emergency Stop */
export const emergencyStop = () => sendPulseCommand("stop");

/** Clear Alarm */
export const clearAlarm = () => sendPulseCommand("ClearAlarm");

/** Gripper commands */
export const moveGripperSoil = () => sendPulseCommand("moveGripperS");
export const returnGripperSoil = () => sendPulseCommand("moveCorrectGripperS");
export const moveGripperWater = () => sendPulseCommand("moveGripperW");
export const returnGripperWater = () => sendPulseCommand("moveCorrectGripperW");