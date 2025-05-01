import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Dashboardlayout from "../../layout/DashboardLayout";
import { getSeoAnalysis } from "../../services/project";
import AnalyticsCard from "../../components/AnalyticsCard";
import DataVisualizer from "../../components/DataVisualizer";
import SkeletonLoader from "../../components/SkeletonLoader";

function ProjectAnalysis() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState({
    traffic: true,
    competitors: true,
    keywords: true,
    comparison: true
  });
  const [visualizationTypes, setVisualizationTypes] = useState({
    trafficTrend: 'line',
    competitors: 'bar',
    keywords: 'table'
  });
  const { projectId } = useParams();

  useEffect(() => {
    fetchAnalysisData();
  }, [projectId]);

  const fetchAnalysisData = async () => {
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
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const changeVisualization = (metric, type) => {
    setVisualizationTypes(prev => ({
      ...prev,
      [metric]: type
    }));
  };

  if (loading) {
    return (
      <Dashboardlayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <SkeletonLoader type="card" />
            <SkeletonLoader type="card" />
          </div>
          <SkeletonLoader type="chart" />
          <div className="mt-8">
            <SkeletonLoader type="table" />
          </div>
        </div>
      </Dashboardlayout>
    );
  }

  if (error) {
    return (
      <Dashboardlayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </Dashboardlayout>
    );
  }

  if (!analysisData) {
    return null;
  }

  return (
    <Dashboardlayout>
      <div className="container mx-auto px-4 py-8">
        {/* Metric Selection */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">SEO Analiz Raporu</h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toggleMetric('traffic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedMetrics.traffic 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Trafik Metrikleri
            </button>
            <button
              onClick={() => toggleMetric('competitors')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedMetrics.competitors 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Rakip Analizi
            </button>
            <button
              onClick={() => toggleMetric('keywords')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedMetrics.keywords 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Anahtar Kelimeler
            </button>
            <button
              onClick={() => toggleMetric('comparison')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedMetrics.comparison 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Karşılaştırmalı Analiz
            </button>
          </div>
        </div>

        {/* Traffic Metrics */}
        {selectedMetrics.traffic && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <AnalyticsCard title="Genel Trafik">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Website Trafiği</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {analysisData.traffic.websiteTraffic}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organik Trafik</p>
                    <p className="text-2xl font-bold text-green-600">
                      {analysisData.traffic.organicTraffic}
                    </p>
                  </div>
                </div>
              </AnalyticsCard>

              <AnalyticsCard title="Rakip Trafiği">
                <div>
                  <p className="text-sm text-gray-500">Toplam Rakip Trafiği</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {analysisData.competitorsOrganicTraffic.overallTraffic}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Fark: {analysisData.competitorsOrganicTraffic.differencePercentage}%
                  </p>
                </div>
              </AnalyticsCard>
            </div>

            <AnalyticsCard title="Trafik Trendi" className="mb-6">
              <div className="mb-4 flex justify-end space-x-2">
                <button
                  onClick={() => changeVisualization('trafficTrend', 'line')}
                  className={`px-3 py-1 rounded text-sm ${
                    visualizationTypes.trafficTrend === 'line'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Çizgi Grafik
                </button>
                <button
                  onClick={() => changeVisualization('trafficTrend', 'bar')}
                  className={`px-3 py-1 rounded text-sm ${
                    visualizationTypes.trafficTrend === 'bar'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
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
                    organik: analysisData.comparativeTrafficData.twentyEightDays.organicTraffic.currentValue,
                    website: analysisData.comparativeTrafficData.twentyEightDays.websiteTraffic.currentValue,
                  },
                  {
                    period: "3 Ay",
                    organik: analysisData.comparativeTrafficData.threeMonths.organicTraffic.currentValue,
                    website: analysisData.comparativeTrafficData.threeMonths.websiteTraffic.currentValue,
                  },
                  {
                    period: "6 Ay",
                    organik: analysisData.comparativeTrafficData.sixMonths.organicTraffic.currentValue,
                    website: analysisData.comparativeTrafficData.sixMonths.websiteTraffic.currentValue,
                  },
                ]}
                config={{
                  xAxis: 'period',
                  lines: [
                    { key: 'organik', color: '#10B981' },
                    { key: 'website', color: '#3B82F6' },
                  ],
                  bars: [
                    { key: 'organik', color: '#10B981' },
                    { key: 'website', color: '#3B82F6' },
                  ],
                }}
              />
            </AnalyticsCard>
          </div>
        )}

        {/* Competitors Analysis */}
        {selectedMetrics.competitors && (
          <AnalyticsCard title="Rakip Analizi" className="mb-8">
            <div className="mb-4 flex justify-end space-x-2">
              <button
                onClick={() => changeVisualization('competitors', 'bar')}
                className={`px-3 py-1 rounded text-sm ${
                  visualizationTypes.competitors === 'bar'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Sütun Grafik
              </button>
              <button
                onClick={() => changeVisualization('competitors', 'table')}
                className={`px-3 py-1 rounded text-sm ${
                  visualizationTypes.competitors === 'table'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tablo
              </button>
            </div>
            <DataVisualizer
              type={visualizationTypes.competitors}
              data={analysisData.competitorsOrganicTraffic.monthlyAverageTrafficData}
              config={{
                xAxis: 'competitor',
                bars: [
                  { key: 'monthlyAverageTraffic', color: '#6366F1' },
                ],
                columns: [
                  { key: 'competitor', label: 'Rakip' },
                  { 
                    key: 'monthlyAverageTraffic', 
                    label: 'Aylık Ortalama Trafik',
                    format: (value) => value.toLocaleString()
                  },
                ],
              }}
            />
          </AnalyticsCard>
        )}

        {/* Keywords Analysis */}
        {selectedMetrics.keywords && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnalyticsCard title="Takip Edilen Kelimeler">
              <div className="space-y-4">
                {analysisData.trackedKeywords.map((keyword) => (
                  <div key={keyword.name} className="flex justify-between items-center">
                    <span className="text-gray-700">{keyword.name}</span>
                    <span className="text-blue-600 font-semibold">
                      {keyword.monthlyClicks} tıklama/ay
                    </span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>

            <AnalyticsCard title="Yükselen Kelimeler">
              <div className="space-y-4">
                {analysisData.risingKeywords.map((keyword) => (
                  <div key={keyword.name} className="flex justify-between items-center">
                    <span className="text-gray-700">{keyword.name}</span>
                    <span className="text-green-600 font-semibold">
                      {keyword.traffic} trafik
                    </span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>

            <AnalyticsCard title="Düşen Kelimeler">
              <div className="space-y-4">
                {analysisData.fallingKeywords.map((keyword) => (
                  <div key={keyword.name} className="flex justify-between items-center">
                    <span className="text-gray-700">{keyword.name}</span>
                    <span className="text-red-600 font-semibold">
                      {keyword.traffic} trafik
                    </span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>
          </div>
        )}

        {/* Comparative Analysis */}
        {selectedMetrics.comparison && (
          <AnalyticsCard title="Karşılaştırmalı Analiz" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 28 Days */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Son 28 Gün</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Organik Trafik</span>
                    <div className="text-right">
                      <span className="block text-sm font-medium text-gray-900">
                        {analysisData.comparativeTrafficData.twentyEightDays.organicTraffic.currentValue}
                      </span>
                      <span className={`text-xs ${
                        analysisData.comparativeTrafficData.twentyEightDays.organicTraffic.differencePercentage > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {analysisData.comparativeTrafficData.twentyEightDays.organicTraffic.differencePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Website Trafiği</span>
                    <div className="text-right">
                      <span className="block text-sm font-medium text-gray-900">
                        {analysisData.comparativeTrafficData.twentyEightDays.websiteTraffic.currentValue}
                      </span>
                      <span className={`text-xs ${
                        analysisData.comparativeTrafficData.twentyEightDays.websiteTraffic.differencePercentage > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {analysisData.comparativeTrafficData.twentyEightDays.websiteTraffic.differencePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Months */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Son 3 Ay</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Organik Trafik</span>
                    <div className="text-right">
                      <span className="block text-sm font-medium text-gray-900">
                        {analysisData.comparativeTrafficData.threeMonths.organicTraffic.currentValue}
                      </span>
                      <span className={`text-xs ${
                        analysisData.comparativeTrafficData.threeMonths.organicTraffic.differencePercentage > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {analysisData.comparativeTrafficData.threeMonths.organicTraffic.differencePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Website Trafiği</span>
                    <div className="text-right">
                      <span className="block text-sm font-medium text-gray-900">
                        {analysisData.comparativeTrafficData.threeMonths.websiteTraffic.currentValue}
                      </span>
                      <span className={`text-xs ${
                        analysisData.comparativeTrafficData.threeMonths.websiteTraffic.differencePercentage > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {analysisData.comparativeTrafficData.threeMonths.websiteTraffic.differencePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 Months */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Son 6 Ay</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Organik Trafik</span>
                    <div className="text-right">
                      <span className="block text-sm font-medium text-gray-900">
                        {analysisData.comparativeTrafficData.sixMonths.organicTraffic.currentValue}
                      </span>
                      <span className={`text-xs ${
                        analysisData.comparativeTrafficData.sixMonths.organicTraffic.differencePercentage > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {analysisData.comparativeTrafficData.sixMonths.organicTraffic.differencePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Website Trafiği</span>
                    <div className="text-right">
                      <span className="block text-sm font-medium text-gray-900">
                        {analysisData.comparativeTrafficData.sixMonths.websiteTraffic.currentValue}
                      </span>
                      <span className={`text-xs ${
                        analysisData.comparativeTrafficData.sixMonths.websiteTraffic.differencePercentage > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {analysisData.comparativeTrafficData.sixMonths.websiteTraffic.differencePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnalyticsCard>
        )}
      </div>
    </Dashboardlayout>
  );
}

export default ProjectAnalysis; 