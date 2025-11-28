"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Gauge,
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  Calendar,
  Zap,
  Lightbulb,
  Target,
  ChevronRight,
  Loader2,
  CalendarCheck,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
// Note: Assuming Shadcn components (Button, Card, Progress, Separator, cn) are available globally or correctly imported.

// ====================================================================
// MOCK DATA: Realistic, diverse data to drive the visualizations
// ====================================================================

const USER_DATA = {
  name: "Gojo Satoru",
  gpa: 4.25,
  activeCourses: 6,
  totalUnits: 18,
  studyGoalMinutes: 300, // 5 hours
  todayStudyMinutes: 210, // 3.5 hours
};

const GPA_HISTORY = [
  { semester: "S1", gpa: 3.5 },
  { semester: "S2", gpa: 3.8 },
  { semester: "S3", gpa: 4.0 },
  { semester: "S4", gpa: 4.25 }, // Current GPA
];

const WEEKLY_STUDY_TIME = [
  { day: "Mon", minutes: 120 },
  { day: "Tue", minutes: 180 },
  { day: "Wed", minutes: 240 },
  { day: "Thu", minutes: 150 },
  { day: "Fri", minutes: 300 }, // Goal hit
  { day: "Sat", minutes: 360 }, // Goal exceeded
  { day: "Sun", minutes: 210 },
];

const UPCOMING_EVENTS = [
  {
    type: "deadline",
    title: "Calculus III Project",
    date: "Fri, Nov 29",
    icon: ClipboardList,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    type: "study",
    title: "Review Elect. Materials",
    date: "Today, 8:00 PM",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    type: "meeting",
    title: "Group Meeting: Statics",
    date: "Tomorrow, 3:30 PM",
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

const AI_RECOMMENDATIONS = [
  {
    title: "Your GPA is trending up!",
    context: "Projected to reach 4.35 next semester.",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    title: "Weakness detected in ODEs",
    context: "Practice 10 non-linear equations.",
    icon: Target,
    color: "text-yellow-500",
  },
  {
    title: "Schedule time to complete Lab 4",
    context: "Estimated 90 minutes remaining.",
    icon: Clock,
    color: "text-blue-500",
  },
];

const CURRENT_STUDY = {
  courseCode: "CEG 211",
  courseTitle: "Mechanics of Materials",
  topic: "Thin-Walled Pressure Vessels",
  progress: 75,
  nextStep: "Review 15 flashcards",
};

// ====================================================================
// ANIMATION VARIANTS
// ====================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// ====================================================================
// MODULAR COMPONENTS
// ====================================================================

/**
 * 1. KPI Cards (Current GPA, Courses, Units)
 */
const KPICard = ({ title, value, icon: Icon, description, colorClass }) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full shadow-lg border-2 border-card-foreground/5 bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-6 w-6", colorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

/**
 * 2. GPA Trend Chart (SVG Line Chart)
 */
const GPATrendChart = () => {
  const maxGpa = 5.0;
  const height = 150;
  const width = 400;
  const padding = 20;

  // Normalize GPA data for SVG path
  const points = GPA_HISTORY.map((data, index) => {
    const x =
      padding + (index / (GPA_HISTORY.length - 1)) * (width - 2 * padding);
    const y = height - padding - (data.gpa / maxGpa) * (height - 2 * padding);
    return { x, y, gpa: data.gpa, semester: data.semester };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <motion.div variants={itemVariants} className="md:col-span-2">
      <Card className="shadow-lg border-2 border-card-foreground/5 bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> GPA Trend
          </CardTitle>
          <CardDescription>
            Performance progression across semesters.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Y-Axis Grid Lines */}
            {[3.0, 4.0, 5.0].map((gpaValue, i) => (
              <line
                key={i}
                x1={padding}
                y1={
                  height -
                  padding -
                  (gpaValue / maxGpa) * (height - 2 * padding)
                }
                x2={width - padding}
                y2={
                  height -
                  padding -
                  (gpaValue / maxGpa) * (height - 2 * padding)
                }
                stroke="var(--muted)"
                strokeDasharray="3 3"
                strokeWidth="0.5"
              />
            ))}

            {/* X-Axis and Labels */}
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="var(--foreground)"
              strokeWidth="1"
            />

            {GPA_HISTORY.map((data, index) => {
              const x =
                padding +
                (index / (GPA_HISTORY.length - 1)) * (width - 2 * padding);
              return (
                <text
                  key={index}
                  x={x}
                  y={height - padding / 2}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                >
                  {data.semester}
                </text>
              );
            })}

            {/* Line Path */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Data Points and Current GPA Label */}
            {points.map((p, i) => (
              <React.Fragment key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="var(--primary)"
                  stroke="var(--background)"
                  strokeWidth="2"
                />
                {i === points.length - 1 && (
                  <text
                    x={p.x + 5}
                    y={p.y - 10}
                    fontSize="12"
                    fontWeight="bold"
                    fill="var(--primary)"
                  >
                    {p.gpa} (Current)
                  </text>
                )}
              </React.Fragment>
            ))}
          </svg>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * 3. Continue Studying Block
 */
const ContinueStudy = () => (
  <motion.div variants={itemVariants} className="md:col-span-1">
    <Card className="bg-primary shadow-xl border-none text-primary-foreground h-full">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Continue Studying</CardTitle>
        <ChevronRight className="w-5 h-5" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium opacity-80">
          {CURRENT_STUDY.courseCode}: {CURRENT_STUDY.courseTitle}
        </p>
        <h3 className="text-2xl font-extrabold">{CURRENT_STUDY.topic}</h3>

        <div className="flex items-center space-x-2">
          <Progress
            value={CURRENT_STUDY.progress}
            className="w-full bg-primary/30 h-2"
            // indicatorClassName="bg-primary-foreground"
          />
          <span className="text-lg font-bold">{CURRENT_STUDY.progress}%</span>
        </div>

        <p className="text-sm opacity-90">{CURRENT_STUDY.nextStep}</p>

        <Button
          variant="secondary"
          className="w-full mt-4 text-primary font-bold hover:bg-secondary/80"
        >
          Quick Start Session
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

/**
 * 4. Weekly Study Time Bar Chart (SVG Bar Chart)
 */
const WeeklyStudyBarChart = () => {
  const maxMinutes = 400;
  const height = 180;
  const width = 360;
  const barWidth = 20;
  const padding = 40;

  return (
    <motion.div variants={itemVariants} className="md:col-span-2">
      <Card className="shadow-lg border-2 border-card-foreground/5 bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" /> Weekly Study Time
            (Mins)
          </CardTitle>
          <CardDescription>
            Your focused study duration this week vs. Goal (
            {USER_DATA.studyGoalMinutes} mins).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Goal Line */}
            <line
              x1={padding}
              y1={
                height -
                padding -
                (USER_DATA.studyGoalMinutes / maxMinutes) *
                  (height - 2 * padding)
              }
              x2={width - padding / 2}
              y2={
                height -
                padding -
                (USER_DATA.studyGoalMinutes / maxMinutes) *
                  (height - 2 * padding)
              }
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text
              x={width - 50}
              y={
                height -
                padding -
                (USER_DATA.studyGoalMinutes / maxMinutes) *
                  (height - 2 * padding) -
                5
              }
              fontSize="10"
              fill="var(--muted-foreground)"
            >
              Goal
            </text>

            {/* X-Axis */}
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding / 2}
              y2={height - padding}
              stroke="var(--foreground)"
              strokeWidth="1"
            />

            {/* Bars and Labels */}
            {WEEKLY_STUDY_TIME.map((data, index) => {
              const x =
                padding +
                (index * (width - padding - barWidth / 2)) /
                  WEEKLY_STUDY_TIME.length +
                barWidth / 2;
              const barHeight =
                (data.minutes / maxMinutes) * (height - 2 * padding);
              const y = height - padding - barHeight;
              const isAboveGoal = data.minutes >= USER_DATA.studyGoalMinutes;

              return (
                <React.Fragment key={index}>
                  {/* Bar */}
                  <motion.rect
                    x={x - barWidth / 2}
                    y={height - padding} // Start from bottom
                    width={barWidth}
                    height={0} // Initial height
                    fill={isAboveGoal ? "var(--green-500)" : "var(--primary)"}
                    rx="4"
                    initial={{ height: 0 }}
                    animate={{
                      height: barHeight,
                      y: y,
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100,
                    }}
                  />
                  {/* X-Axis Label */}
                  <text
                    x={x}
                    y={height - padding / 2}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--muted-foreground)"
                  >
                    {data.day}
                  </text>
                </React.Fragment>
              );
            })}
          </svg>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * 5. Did You Know / Gamification Card
 */
const DidYouKnowCard = () => (
  <motion.div variants={itemVariants} className="md:col-span-1">
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-yellow-700 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Did You Know?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          &quot;Newton developed calculus during quarantine—a small, unexpected
          fact that keeps learning fun and memorable.&quot;
        </p>
        <Separator />
        <div className="flex items-center space-x-3 text-sm font-semibold text-primary">
          <Zap className="w-4 h-4 text-orange-600" />
          <span>Streak: 7 days! Keep it up!</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <CalendarCheck className="w-4 h-4" />
          <span>
            Today's Study Goal: {USER_DATA.todayStudyMinutes}/
            {USER_DATA.studyGoalMinutes} mins
          </span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

/**
 * 6. Upcoming Events / Planner
 */
const UpcomingEvents = () => (
  <motion.div variants={itemVariants} className="md:col-span-1">
    <Card className="shadow-lg border-2 border-card-foreground/5 bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" /> Upcoming Planner
        </CardTitle>
        <CardDescription>
          Deadlines and scheduled study sessions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {UPCOMING_EVENTS.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
              "flex items-center p-3 rounded-lg border",
              event.bg,
              event.color
            )}
          >
            <event.icon
              className={cn("w-5 h-5 mr-3 flex-shrink-0", event.color)}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{event.title}</p>
              <p className="text-xs font-medium opacity-80">{event.date}</p>
            </div>
          </motion.div>
        ))}
        <Button
          variant="link"
          size="sm"
          className="w-full justify-center text-primary pt-2"
        >
          View Full Planner &rarr;
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

/**
 * 7. AI Recommendations / Study Assistant
 */
const StudyAssistant = () => (
  <motion.div variants={itemVariants} className="md:col-span-1">
    <Card className="shadow-lg border-2 border-card-foreground/5 bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-500" /> Study Assistant
        </CardTitle>
        <CardDescription>
          AI-generated recommendations and insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {AI_RECOMMENDATIONS.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
            className="flex items-start border-b border-border/70 pb-3 last:border-b-0"
          >
            <rec.icon
              className={cn("w-4 h-4 mt-1 mr-3 flex-shrink-0", rec.color)}
            />
            <div>
              <p className="font-semibold text-sm text-foreground">
                {rec.title}
              </p>
              <p className="text-xs text-muted-foreground">{rec.context}</p>
            </div>
          </motion.div>
        ))}
        <Button
          variant="link"
          size="sm"
          className="w-full justify-center text-purple-500 pt-2"
        >
          Ask the Tutor &rarr;
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

// ====================================================================
// MAIN DASHBOARD PAGE
// ====================================================================

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10 bg-background min-h-screen">
      {/* Header / Welcome */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Welcome back, {USER_DATA.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your personalized academic overview for the semester.
        </p>
      </header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Row 1: KPI Cards */}
        <KPICard
          title="Current GPA"
          value={USER_DATA.gpa.toFixed(2)}
          icon={Gauge}
          description="Weighted average across all courses"
          colorClass="text-primary"
        />
        <KPICard
          title="Active Courses"
          value={USER_DATA.activeCourses}
          icon={BookOpen}
          description="Courses currently in progress"
          colorClass="text-sky-500"
        />
        <KPICard
          title="Total Units"
          value={USER_DATA.totalUnits}
          icon={GraduationCap}
          description="Total academic credit units this term"
          colorClass="text-purple-500"
        />

        {/* Continue Studying (Quick Action) */}
        <ContinueStudy />

        {/* Row 2: Charts and Quick Actions */}
        <GPATrendChart />
        <DidYouKnowCard />

        <WeeklyStudyBarChart />
        <UpcomingEvents />
        <StudyAssistant />
      </motion.div>
    </div>
  );
}
