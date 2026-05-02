import { useState, useCallback, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

const CATEGORIES = [
  { id: "food", label: "🍔 אוכל ומסעדות", color: "#FF6B6B" },
  { id: "transport", label: "🚗 תחבורה", color: "#4ECDC4" },
  { id: "shopping", label: "🛍️ קניות", color: "#FFE66D" },
  { id: "health", label: "💊 בריאות", color: "#A8E6CF" },
  { id: "entertainment", label: "🎬 בילויים", color: "#DDA0DD" },
  { id: "bills", label: "📄 חשבונות", color: "#87CEEB" },
  { id: "education", label: "📚 חינוך", color: "#F0A500" },
  { id: "other", label: "📦 אחר", color: "#C0C0C0" },
];

const MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

function formatILS(n) {
  return new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);
}

function guessCategory(description = "") {
  const d = description.toLowerCase();
  if (/מסעד|אוכל|קפה|סופר|שופרסל|רמי לוי|מקדונלד|בורגר|פיצה/.test(d)) return "food";
  if (/דלק|חניה|אוטובוס|רכבת|מונית|אובר|גט/.test(d)) return "transport";
  if (/זארה|h&m|שופינג|קניון|אמזון|אלי/.test(d)) return "shopping";
  if (/בית חולים|רופא|תרופה|קופת חולים|מאוחדת|מכבי/.test(d)) return "health";
  if (/סרט|קולנוע|נטפליקס|ספוטיפיי|גיימינג|בילוי/.test(d)) return "entertainment";
  if (/חשמל|מים|גז|טלפון|אינטרנט|ביטוח|שכירות/.test(d)) return "bills";
  if (/קורס|לימוד|ספר|אוניברסיטה/.test(d)) return "education";
  return "other";
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem("budget-app-data");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  const d = {};
  for (let m = 0; m < 12; m++) {
    d[`${currentYear}-${m}`] = { salary: 0, extra: 0, savings: 0, transactions: [] };
  }
  return d;
}
