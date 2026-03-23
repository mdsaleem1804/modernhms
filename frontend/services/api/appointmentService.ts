import { mockDb, MOCK_DOCTORS } from "./mockData";
import { Appointment, AppointmentStatus, ActivityLog } from "./types";

const DELAY = 300;

export const appointmentService = {
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(DELAY);
    return mockDb.getAppointments();
  },

  getActivityLogs: async (id: string): Promise<ActivityLog[]> => {
    await delay(100);
    return mockDb.getActivityLogs(id);
  },

  createAppointment: async (data: any): Promise<Appointment> => {
    await delay(DELAY);
    const newApp: Appointment = {
      ...data,
      id: String(Date.now()),
      tokenNo: `T-${100 + mockDb.getAppointments().length + 1}`,
      status: "Booked",
      time: data.timeSlot,
      patientName: mockDb.getById(data.patientId)?.fullName || "Unknown",
      doctorName: MOCK_DOCTORS.find(d => d.id === data.doctorId)?.name || "Unknown",
    };
    
    mockDb.addAppointment(newApp);
    
    mockDb.addLog({
      id: `log-${Date.now()}`,
      appointmentId: newApp.id,
      action: "Created",
      description: "Appointment created via reception portal",
      performedBy: "Receptionist",
      timestamp: new Date().toISOString()
    });

    return newApp;
  },

  updateAppointment: async (id: string, data: any): Promise<Appointment | undefined> => {
    await delay(DELAY);
    const updated = mockDb.updateAppointment(id, {
      ...data,
      time: data.timeSlot,
      doctorName: MOCK_DOCTORS.find(d => d.id === data.doctorId)?.name || "Unknown",
    });

    if (updated) {
      mockDb.addLog({
        id: `log-${Date.now()}`,
        appointmentId: id,
        action: "Edited",
        description: "Appointment details modified",
        performedBy: "Receptionist",
        timestamp: new Date().toISOString()
      });
    }
    return updated;
  },

  updateStatus: async (id: string, status: AppointmentStatus): Promise<Appointment | undefined> => {
    await delay(DELAY);
    const updated = mockDb.updateAppointment(id, { status });

    if (updated) {
      let action: ActivityLog["action"];
      let desc = "";

      switch (status) {
        case "Checked-In": 
          action = "Checked-In"; 
          desc = "Patient arrived at reception"; 
          break;
        case "In Consultation": 
          action = "Consultation Started"; 
          desc = "Doctor started clinical review"; 
          break;
        case "Completed": 
          action = "Completed"; 
          desc = "Consultation finished"; 
          break;
        case "Cancelled": 
          action = "Cancelled"; 
          desc = "Appointment cancelled"; 
          break;
        default: 
          action = "Created"; // Fallback
      }

      mockDb.addLog({
        id: `log-${Date.now()}`,
        appointmentId: id,
        action: action,
        description: desc,
        performedBy: status === "In Consultation" ? "Doctor" : "Receptionist",
        timestamp: new Date().toISOString()
      });
    }
    return updated;
  }
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
