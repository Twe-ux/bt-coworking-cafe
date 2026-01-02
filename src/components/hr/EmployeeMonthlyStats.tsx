"use client";

import { calculateDuration } from "@/lib/utils/planning";
import { Icon } from "@iconify/react";
import { Card, Col, Row } from "react-bootstrap";

// Types
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeRole: string;
  contractualHours: number;
}

interface Shift {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeRole: string;
  };
  date: string;
  startTime: string;
  endTime: string;
}

interface EmployeeMonthlyStatsProps {
  employees: Employee[];
  shifts: Shift[];
  currentDate: Date;
}

// Color palette for employees (same as calendar)
const EMPLOYEE_COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#F97316", // Orange
];

export default function EmployeeMonthlyStats({
  employees,
  shifts,
  currentDate,
}: EmployeeMonthlyStatsProps) {
  // Get employee color
  const getEmployeeColor = (employeeId: string) => {
    const index = employees.findIndex((emp) => emp._id === employeeId);
    return EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length];
  };

  // Format month/year for title
  const formatMonthYear = () => {
    return currentDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  // Calculate monthly contractual hours (weekly hours × 4.33)
  const calculateContractualMonthlyHours = (weeklyHours: number) => {
    const totalMinutes = Math.round(weeklyHours * 4.33 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Get all shifts for an employee in the current month
  const getEmployeeMonthShifts = (employeeId: string) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return shifts.filter((shift) => {
      if (shift.employeeId._id !== employeeId) return false;

      // Parse shift date and compare year/month/day only
      const shiftDate = new Date(shift.date);
      const shiftYear = shiftDate.getFullYear();
      const shiftMonth = shiftDate.getMonth();

      return shiftYear === year && shiftMonth === month;
    });
  };

  // Calculate planned hours for the entire month
  const calculatePlannedHours = (employeeId: string) => {
    const monthShifts = getEmployeeMonthShifts(employeeId);
    let totalMinutes = 0;

    monthShifts.forEach((shift) => {
      const durationInHours = calculateDuration(shift.startTime, shift.endTime);
      totalMinutes += durationInHours * 60;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Calculate actual hours (from clocking - not implemented yet)
  const calculateActualHours = (employeeId: string) => {
    // TODO: Will be calculated from time entries once clocking system is implemented
    return "0:00";
  };

  // Calculate projected hours (actual + remaining planned)
  const calculateProjectedHours = (employeeId: string) => {
    const monthShifts = getEmployeeMonthShifts(employeeId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let actualMinutes = 0; // TODO: Get from time entries
    let remainingPlannedMinutes = 0;

    monthShifts.forEach((shift) => {
      const shiftDate = new Date(shift.date);
      shiftDate.setHours(0, 0, 0, 0);

      // If shift is today or in the future, add to remaining planned
      if (shiftDate >= today) {
        const durationInHours = calculateDuration(shift.startTime, shift.endTime);
        remainingPlannedMinutes += durationInHours * 60;
      }
    });

    const totalMinutes = actualMinutes + remainingPlannedMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center mb-3">
        <Icon icon="eva:calendar-outline" width={24} className="me-2" />
        <h5 className="mb-0 text-capitalize">
          Statistiques Mensuelles - {formatMonthYear()}
        </h5>
      </div>

      <Row className="g-3">
        {employees.map((employee) => {
          const color = getEmployeeColor(employee._id);
          const contractualMonthlyHours = calculateContractualMonthlyHours(
            employee.contractualHours
          );
          const plannedHours = calculatePlannedHours(employee._id);
          const actualHours = calculateActualHours(employee._id);
          const projectedHours = calculateProjectedHours(employee._id);

          return (
            <Col key={employee._id} md={6} lg={4}>
              <Card>
                <Card.Body>
                  {/* Employee Header */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          marginRight: "8px",
                        }}
                      />
                      <div>
                        <h6 className="mb-0">
                          {employee.firstName} {employee.lastName}
                        </h6>
                        <small className="text-muted">{employee.employeeRole}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
                        Contractuel
                      </small>
                      <strong style={{ fontSize: "0.9rem" }}>
                        {contractualMonthlyHours}
                      </strong>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="d-flex flex-column gap-2">
                    {/* Planned Hours */}
                    <div
                      className="d-flex align-items-center justify-content-between p-2 rounded"
                      style={{ backgroundColor: "#e7f1ff" }}
                    >
                      <div className="d-flex align-items-center">
                        <Icon
                          icon="eva:calendar-outline"
                          width={20}
                          className="me-2"
                          style={{ color: "#0d6efd" }}
                        />
                        <span style={{ fontSize: "0.85rem" }}>Heures planifiées</span>
                      </div>
                      <strong style={{ color: "#0d6efd", fontSize: "0.9rem" }}>
                        {plannedHours}
                      </strong>
                    </div>

                    {/* Actual Hours */}
                    <div
                      className="d-flex align-items-center justify-content-between p-2 rounded"
                      style={{ backgroundColor: "#d1fae5" }}
                    >
                      <div className="d-flex align-items-center">
                        <Icon
                          icon="eva:clock-outline"
                          width={20}
                          className="me-2"
                          style={{ color: "#10b981" }}
                        />
                        <span style={{ fontSize: "0.85rem" }}>Heures réalisées</span>
                      </div>
                      <strong style={{ color: "#10b981", fontSize: "0.9rem" }}>
                        {actualHours}
                      </strong>
                    </div>

                    {/* Projected Hours */}
                    <div
                      className="d-flex align-items-center justify-content-between p-2 rounded"
                      style={{ backgroundColor: "#ede9fe" }}
                    >
                      <div className="d-flex align-items-center">
                        <Icon
                          icon="eva:trending-up-outline"
                          width={20}
                          className="me-2"
                          style={{ color: "#8b5cf6" }}
                        />
                        <span style={{ fontSize: "0.85rem" }}>Heures projetées</span>
                      </div>
                      <strong style={{ color: "#8b5cf6", fontSize: "0.9rem" }}>
                        {projectedHours}
                      </strong>
                    </div>
                  </div>

                  {/* Footer note */}
                  {actualHours === "0:00" && (
                    <div className="mt-2 p-2 rounded" style={{ backgroundColor: "#f0f9ff" }}>
                      <small className="text-primary" style={{ fontSize: "0.75rem" }}>
                        Pas d'heures pointées ce mois-ci
                      </small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
