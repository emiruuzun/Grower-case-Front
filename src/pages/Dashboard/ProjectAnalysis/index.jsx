import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboardlayout from "../../../layout/DashboardLayout";
import { getSeoAnalysis } from "../../../services/project";
import AnalyticsCard from "../../../components/AnalyticsCard";
import DataVisualizer from "../../../components/DataVisualizer";
import SkeletonLoader from "../../../components/SkeletonLoader";

function ProjectAnalysis() {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [visualizationTypes, setVisualizationTypes] = useState({
    trafficTrend: "line",
    competitors: "bar",
    keywords: "table",
  });
  const { projectId } = useParams();
  const [timeRange, setTimeRange] = useState("28days");

  const fetchAnalysisData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSeoAnalysis(projectId);
      setAnalysisData(data);
      setError(null);
    } catch (err) {
      setError("SEO analiz verileri yüklenirken bir hata oluştu.");
      console.error("Error fetching analysis data:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  const changeVisualization = (metric, type) => {
    setVisualizationTypes((prev) => ({
      ...prev,
      [metric]: type,
    }));
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Formatted numbers with K, M suffix for better readability
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Enhanced component for trend display
  const TrendIndicator = ({ value, showPercentage = true }) => {
    if (value === 0) {
      return (
        <span className="inline-flex items-center text-gray-500 font-medium">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 12H4"
            />
          </svg>
          {showPercentage && "0%"}
        </span>
      );
    }

    const isPositive = value > 0;
    return (
      <span
        className={`inline-flex items-center font-medium ${
          isPositive ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {isPositive ? (
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        )}
        {showPercentage && `${Math.abs(value)}%`}
      </span>
    );
  };

  // Comparison metric card
  const MetricCard = ({ title, value, trend, icon, color = "indigo" }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatNumber(value)}
            </h3>
            <div className="mt-2 flex items-center">
              <TrendIndicator value={trend} />
              <span className="text-xs text-gray-500 ml-2">
                Son{" "}
                {timeRange === "28days"
                  ? "28 gün"
                  : timeRange === "3months"
                  ? "3 ay"
                  : "6 ay"}
              </span>
            </div>
          </div>
          <div
            className={`flex items-center justify-center h-12 w-12 rounded-lg bg-${color}-100 text-${color}-600 text-xl`}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced comparison card with better visual hierarchy
  const ComparisonCard = ({ title, data }) => {
    const getTrendColor = (trend) => {
      if (trend > 0) return "text-emerald-600";
      if (trend < 0) return "text-rose-600";
      return "text-gray-500";
    };

    const getTrendIcon = (trend) => {
      if (trend > 0) return "↑";
      if (trend < 0) return "↓";
      return "−";
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition duration-200">
        <h3 className="font-semibold text-lg text-gray-800 pb-3 mb-4 border-b border-gray-100">
          {title}
        </h3>
        <div className="space-y-6">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Organik Trafik
              </h4>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">
                  {formatNumber(data.organicTraffic.currentValue)}
                </span>
                <div
                  className={`ml-3 px-2 py-0.5 rounded-full text-sm ${getTrendColor(
                    data.organicTraffic.differencePercentage
                  )} bg-opacity-10 ${getTrendColor(
                    data.organicTraffic.differencePercentage
                  ).replace("text-", "bg-")}`}
                >
                  {getTrendIcon(data.organicTraffic.differencePercentage)}
                  {Math.abs(data.organicTraffic.differencePercentage).toFixed(
                    1
                  )}
                  %
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Website Trafiği
              </h4>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">
                  {formatNumber(data.websiteTraffic.currentValue)}
                </span>
                <div
                  className={`ml-3 px-2 py-0.5 rounded-full text-sm ${getTrendColor(
                    data.websiteTraffic.differencePercentage
                  )} bg-opacity-10 ${getTrendColor(
                    data.websiteTraffic.differencePercentage
                  ).replace("text-", "bg-")}`}
                >
                  {getTrendIcon(data.websiteTraffic.differencePercentage)}
                  {Math.abs(data.websiteTraffic.differencePercentage).toFixed(
                    1
                  )}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Keyword card component
  const KeywordCard = ({ title, keywords, type }) => {
    const getTextColor = () => {
      if (type === "rising") return "text-emerald-600";
      if (type === "falling") return "text-rose-600";
      return "text-blue-600";
    };

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
        <div
          className={`h-1 ${
            type === "rising"
              ? "bg-emerald-500"
              : type === "falling"
              ? "bg-rose-500"
              : "bg-blue-500"
          }`}
        ></div>
        <div className="p-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">{title}</h3>
          <div className="space-y-3">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      type === "rising"
                        ? "bg-emerald-100"
                        : type === "falling"
                        ? "bg-rose-100"
                        : "bg-blue-100"
                    } mr-3 text-xs font-medium`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {keyword.name}
                  </span>
                </div>
                <span className={`font-semibold ${getTextColor()}`}>
                  {formatNumber(keyword.traffic || keyword.monthlyClicks)}{" "}
                  {keyword.monthlyClicks ? "tıklama" : "trafik"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Dashboardlayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse mr-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader key={i} type="card" />
            ))}
          </div>

          <SkeletonLoader type="chart" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonLoader key={i} type="card" />
            ))}
          </div>
        </div>
      </Dashboardlayout>
    );
  }

  if (error) {
    return (
      <Dashboardlayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              Veri Yüklenemedi
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={handleBackToDashboard}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
            >
              Dashboard'a Dön
            </button>
          </div>
        </div>
      </Dashboardlayout>
    );
  }

  if (!analysisData) {
    return null;
  }

  // Data preparation for time range selection
  const getComparisonData = () => {
    switch (timeRange) {
      case "28days":
        return analysisData.comparativeTrafficData.twentyEightDays;
      case "3months":
        return analysisData.comparativeTrafficData.threeMonths;
      case "6months":
        return analysisData.comparativeTrafficData.sixMonths;
      default:
        return analysisData.comparativeTrafficData.twentyEightDays;
    }
  };

  return (
    <Dashboardlayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with breadcrumbs and project title */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <button
              onClick={handleBackToDashboard}
              className="hover:text-indigo-600 transition"
            >
              Dashboard
            </button>
            <svg
              className="mx-2 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 font-medium">SEO Analiz</span>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">📊</span> SEO Analiz Raporu
              </h1>
              <p className="text-gray-500 mt-1">
                Projenizin SEO performansını analiz edin ve rekabet avantajı
                sağlayın
              </p>
            </div>

            {/* Time range selector */}
            <div className="bg-white rounded-lg flex p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setTimeRange("28days")}
                className={`px-3 py-1.5 rounded text-sm font-medium ${
                  timeRange === "28days"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Son 28 Gün
              </button>
              <button
                onClick={() => setTimeRange("3months")}
                className={`px-3 py-1.5 rounded text-sm font-medium ${
                  timeRange === "3months"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                3 Ay
              </button>
              <button
                onClick={() => setTimeRange("6months")}
                className={`px-3 py-1.5 rounded text-sm font-medium ${
                  timeRange === "6months"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                6 Ay
              </button>
            </div>
          </div>
        </div>

        {/* Key metrics dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Website Trafiği"
            value={analysisData.traffic.websiteTraffic}
            trend={getComparisonData().websiteTraffic.differencePercentage}
            icon="🌐"
            color="blue"
          />
          <MetricCard
            title="Organik Trafik"
            value={analysisData.traffic.organicTraffic}
            trend={getComparisonData().organicTraffic.differencePercentage}
            icon="🚀"
            color="emerald"
          />
          <MetricCard
            title="Rakip Trafiği"
            value={analysisData.competitorsOrganicTraffic.overallTraffic}
            trend={analysisData.competitorsOrganicTraffic.differencePercentage}
            icon="👥"
            color="purple"
          />
          <MetricCard
            title="Takip Edilen Kelimeler"
            value={analysisData.trackedKeywords.length}
            trend={0}
            icon="🔍"
            color="amber"
          />
        </div>

        {/* Main tabs navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab("traffic")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "traffic"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Trafik Analizi
            </button>
            <button
              onClick={() => setActiveTab("competitors")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "competitors"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rakip Analizi
            </button>
            <button
              onClick={() => setActiveTab("keywords")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "keywords"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Anahtar Kelimeler
            </button>
          </nav>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 gap-8">
              {/* Traffic Trend Chart */}
              <AnalyticsCard title="Trafik Trendi" className="mb-6">
                <div className="mb-4 flex justify-end space-x-2">
                  <button
                    onClick={() => changeVisualization("trafficTrend", "line")}
                    className={`px-3 py-1 rounded text-sm ${
                      visualizationTypes.trafficTrend === "line"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Çizgi Grafik
                  </button>
                  <button
                    onClick={() => changeVisualization("trafficTrend", "bar")}
                    className={`px-3 py-1 rounded text-sm ${
                      visualizationTypes.trafficTrend === "bar"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Sütun Grafik
                  </button>
                </div>
                <DataVisualizer
                  type={visualizationTypes.trafficTrend}
                  data={[
                    {
                      period: "28 Gün",
                      organik:
                        analysisData.comparativeTrafficData.twentyEightDays
                          .organicTraffic.currentValue,
                      website:
                        analysisData.comparativeTrafficData.twentyEightDays
                          .websiteTraffic.currentValue,
                    },
                    {
                      period: "3 Ay",
                      organik:
                        analysisData.comparativeTrafficData.threeMonths
                          .organicTraffic.currentValue,
                      website:
                        analysisData.comparativeTrafficData.threeMonths
                          .websiteTraffic.currentValue,
                    },
                    {
                      period: "6 Ay",
                      organik:
                        analysisData.comparativeTrafficData.sixMonths
                          .organicTraffic.currentValue,
                      website:
                        analysisData.comparativeTrafficData.sixMonths
                          .websiteTraffic.currentValue,
                    },
                  ]}
                  config={{
                    xAxis: "period",
                    lines: [
                      { key: "organik", color: "#10B981" },
                      { key: "website", color: "#3B82F6" },
                    ],
                    bars: [
                      { key: "organik", color: "#10B981" },
                      { key: "website", color: "#3B82F6" },
                    ],
                  }}
                />
              </AnalyticsCard>

              {/* Keyword snapshots */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Anahtar Kelime Durumu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <KeywordCard
                    title="Takip Edilen Kelimeler"
                    keywords={analysisData.trackedKeywords.slice(0, 5)}
                    type="tracked"
                  />
                  <KeywordCard
                    title="Yükselen Kelimeler"
                    keywords={analysisData.risingKeywords.slice(0, 5)}
                    type="rising"
                  />
                  <KeywordCard
                    title="Düşen Kelimeler"
                    keywords={analysisData.fallingKeywords.slice(0, 5)}
                    type="falling"
                  />
                </div>
              </div>

              {/* Competitors snapshot */}
              <AnalyticsCard title="Rakip Performansı" className="mt-6">
                <div className="mb-4 flex justify-end space-x-2">
                  <button
                    onClick={() => changeVisualization("competitors", "bar")}
                    className={`px-3 py-1 rounded text-sm ${
                      visualizationTypes.competitors === "bar"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Sütun Grafik
                  </button>
                  <button
                    onClick={() => changeVisualization("competitors", "table")}
                    className={`px-3 py-1 rounded text-sm ${
                      visualizationTypes.competitors === "table"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Tablo
                  </button>
                </div>
                <DataVisualizer
                  type={visualizationTypes.competitors}
                  data={
                    analysisData.competitorsOrganicTraffic
                      .monthlyAverageTrafficData
                  }
                  config={{
                    xAxis: "competitor",
                    bars: [{ key: "monthlyAverageTraffic", color: "#6366F1" }],
                    columns: [
                      { key: "competitor", label: "Rakip" },
                      {
                        key: "monthlyAverageTraffic",
                        label: "Aylık Ortalama Trafik",
                        format: (value) => value.toLocaleString(),
                      },
                    ],
                  }}
                />
              </AnalyticsCard>
            </div>
          </>
        )}

        {/* Traffic Tab Content */}
        {activeTab === "traffic" && (
          <div className="space-y-8">
            <AnalyticsCard title="Trafik Performansı" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ComparisonCard
                  title="Son 28 Gün"
                  data={analysisData.comparativeTrafficData.twentyEightDays}
                />
                <ComparisonCard
                  title="Son 3 Ay"
                  data={analysisData.comparativeTrafficData.threeMonths}
                />
                <ComparisonCard
                  title="Son 6 Ay"
                  data={analysisData.comparativeTrafficData.sixMonths}
                />
              </div>
            </AnalyticsCard>

            <AnalyticsCard title="Detaylı Trafik Trendi" className="mb-6">
              <div className="mb-4 flex justify-end space-x-2">
                <button
                  onClick={() => changeVisualization("trafficTrend", "line")}
                  className={`px-3 py-1 rounded text-sm ${
                    visualizationTypes.trafficTrend === "line"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Çizgi Grafik
                </button>
                <button
                  onClick={() => changeVisualization("trafficTrend", "bar")}
                  className={`px-3 py-1 rounded text-sm ${
                    visualizationTypes.trafficTrend === "bar"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Sütun Grafik
                </button>
              </div>
              <DataVisualizer
                type={visualizationTypes.trafficTrend}
                data={[
                  {
                    period: "28 Gün",
                    organik:
                      analysisData.comparativeTrafficData.twentyEightDays
                        .organicTraffic.currentValue,
                    website:
                      analysisData.comparativeTrafficData.twentyEightDays
                        .websiteTraffic.currentValue,
                  },
                  {
                    period: "3 Ay",
                    organik:
                      analysisData.comparativeTrafficData.threeMonths
                        .organicTraffic.currentValue,
                    website:
                      analysisData.comparativeTrafficData.threeMonths
                        .websiteTraffic.currentValue,
                  },
                  {
                    period: "6 Ay",
                    organik:
                      analysisData.comparativeTrafficData.sixMonths
                        .organicTraffic.currentValue,
                    website:
                      analysisData.comparativeTrafficData.sixMonths
                        .websiteTraffic.currentValue,
                  },
                ]}
                config={{
                  xAxis: "period",
                  lines: [
                    { key: "organik", color: "#10B981" },
                    { key: "website", color: "#3B82F6" },
                  ],
                  bars: [
                    { key: "organik", color: "#10B981" },
                    { key: "website", color: "#3B82F6" },
                  ],
                }}
              />
            </AnalyticsCard>
          </div>
        )}

        {/* Competitors Tab Content */}
        {activeTab === "competitors" && (
          <AnalyticsCard title="Rakip Analizi" className="mb-8">
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full p-2 bg-indigo-100">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-indigo-800">
                    Rakip Trafiği Özeti
                  </h3>
                  <p className="text-sm text-indigo-600">
                    Toplam rakip trafiği:{" "}
                    <span className="font-medium">
                      {formatNumber(
                        analysisData.competitorsOrganicTraffic.overallTraffic
                      )}
                    </span>
                    . Sizinle aradaki fark:{" "}
                    <TrendIndicator
                      value={
                        analysisData.competitorsOrganicTraffic
                          .differencePercentage
                      }
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 flex justify-end space-x-2">
              <button
                onClick={() => changeVisualization("competitors", "bar")}
                className={`px-3 py-1 rounded text-sm ${
                  visualizationTypes.competitors === "bar"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Sütun Grafik
              </button>
              <button
                onClick={() => changeVisualization("competitors", "table")}
                className={`px-3 py-1 rounded text-sm ${
                  visualizationTypes.competitors === "table"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Tablo
              </button>
            </div>
            <DataVisualizer
              type={visualizationTypes.competitors}
              data={
                analysisData.competitorsOrganicTraffic.monthlyAverageTrafficData
              }
              config={{
                xAxis: "competitor",
                bars: [{ key: "monthlyAverageTraffic", color: "#6366F1" }],
                columns: [
                  { key: "competitor", label: "Rakip" },
                  {
                    key: "monthlyAverageTraffic",
                    label: "Aylık Ortalama Trafik",
                    format: (value) => value.toLocaleString(),
                  },
                ],
              }}
            />

            <div className="mt-8 bg-amber-50 p-4 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-2">
                Rekabetçi İyileştirme Önerileri
              </h3>
              <ul className="space-y-2 text-amber-700">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    En başarılı rakiplerinizin anahtar kelime stratejilerini
                    analiz edin.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Rakiplerinizin kullandığı backlink kaynaklarını araştırın.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    İçerik stratejinizi rakiplerinizin odaklandığı alanlara göre
                    şekillendirin.
                  </span>
                </li>
              </ul>
            </div>
          </AnalyticsCard>
        )}

        {/* Keywords Tab Content */}
        {activeTab === "keywords" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KeywordCard
                title="Takip Edilen Kelimeler"
                keywords={analysisData.trackedKeywords}
                type="tracked"
              />
              <KeywordCard
                title="Yükselen Kelimeler"
                keywords={analysisData.risingKeywords}
                type="rising"
              />
              <KeywordCard
                title="Düşen Kelimeler"
                keywords={analysisData.fallingKeywords}
                type="falling"
              />
            </div>

            <AnalyticsCard title="Anahtar Kelime Performansı" className="mt-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 rounded-full p-2 bg-blue-100">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Anahtar Kelime Özeti
                    </h3>
                    <p className="text-sm text-blue-600">
                      Toplam {analysisData.trackedKeywords.length} kelime takip
                      ediliyor. {analysisData.risingKeywords.length} kelime
                      yükselişte, {analysisData.fallingKeywords.length} kelime
                      düşüşte.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Anahtar Kelime
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Aylık Tıklama
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Trend
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Sıralama
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {analysisData.trackedKeywords
                      .slice(0, 8)
                      .map((keyword, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {keyword.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatNumber(keyword.monthlyClicks)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <TrendIndicator
                              value={
                                idx % 3 === 0 ? 15 : idx % 3 === 1 ? -10 : 0
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Top 10
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Detay{" "}
                              <span className="sr-only">, {keyword.name}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Tüm Anahtar Kelimeleri Görüntüle
                  <svg
                    className="ml-2 -mr-1 h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </AnalyticsCard>
          </div>
        )}

        {/* Footer action buttons */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Dashboard'a Dön
          </button>

          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg
                className="mr-2 -ml-1 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              PDF İndir
            </button>

            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg
                className="mr-2 -ml-1 h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Rapor Oluştur
            </button>
          </div>
        </div>
      </div>
    </Dashboardlayout>
  );
}

export default ProjectAnalysis;
