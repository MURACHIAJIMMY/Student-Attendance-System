import React from 'react';

export default function StudentSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="space-y-2">
      <p>
        <strong>Student ID:</strong> {summary.studentId}
      </p>

      {summary.range && (
        <p>
          <strong>Date Range:</strong> {summary.range.from} to {summary.range.to}
        </p>
      )}

      <p>
        <strong>Total Sessions:</strong> {summary.stats.total}
      </p>
      <p>
        <strong>Present:</strong> {summary.stats.present}
      </p>
      <p>
        <strong>Absent:</strong> {summary.stats.absent}
      </p>
      <p>
        <strong>Late:</strong> {summary.stats.late}
      </p>
      <p>
        <strong>Attendance %:</strong> {summary.percentage}
      </p>

      {summary.belowThreshold && (
        <p className="text-red-600 font-semibold">
          ⚠ Below Attendance Threshold
        </p>
      )}
    </div>
  );
}
