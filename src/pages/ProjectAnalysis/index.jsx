import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Dashboardlayout from "../../layout/DashboardLayout";
import { getSeoAnalysis } from "../../services/project";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function ProjectAnalysis() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) {
    return (
      <Dashboardlayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <LoadingSpinner />
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

  const trafficComparisonData = [
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
  ];

  return (
    <Dashboardlayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">SEO Analiz Raporu</h1>

        {/* Trafik Özeti */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Genel Trafik</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Website Trafiği</p>
                <p className="text-2xl font-bold text-blue-600">{analysisData.traffic.websiteTraffic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organik Trafik</p>
                <p className="text-2xl font-bold text-green-600">{analysisData.traffic.organicTraffic}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rakip Trafiği</h2>
            <div>
              <p className="text-sm text-gray-500">Toplam Rakip Trafiği</p>
              <p className="text-2xl font-bold text-purple-600">
                {analysisData.competitorsOrganicTraffic.overallTraffic}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Fark: {analysisData.competitorsOrganicTraffic.differencePercentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Trafik Karşılaştırma Grafiği */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trafik Karşılaştırması</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="organik"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="website"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rakip Analizi */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rakip Analizi</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisData.competitorsOrganicTraffic.monthlyAverageTrafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="competitor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="monthlyAverageTraffic" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rakip Anahtar Kelimeleri */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rakip Anahtar Kelimeleri</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anahtar Kelime
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arama Hacmi
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aylık Tıklama
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analysisData.competitorsKeywordData.map((keyword, index) => {
                  const trackedKeyword = analysisData.trackedKeywords.find(
                    (tk) => tk.name === keyword.keyword
                  );
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {keyword.keyword}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {keyword.searchVolume.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {trackedKeyword ? trackedKeyword.monthlyClicks.toLocaleString() : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Anahtar Kelimeler Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Takip Edilen Kelimeler */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Takip Edilen Kelimeler</h2>
            <div className="space-y-4">
              {analysisData.trackedKeywords.map((keyword) => (
                <div key={keyword.name} className="flex justify-between items-center">
                  <span className="text-gray-700">{keyword.name}</span>
                  <span className="text-blue-600 font-semibold">{keyword.monthlyClicks} tıklama/ay</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yükselen Kelimeler */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Yükselen Anahtar Kelimeler</h2>
            <div className="space-y-4">
              {analysisData.risingKeywords.map((keyword) => (
                <div key={keyword.name} className="flex justify-between items-center">
                  <span className="text-gray-700">{keyword.name}</span>
                  <span className="text-green-600 font-semibold">{keyword.traffic} trafik</span>
                </div>
              ))}
            </div>
          </div>

          {/* Düşen Kelimeler */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Düşen Anahtar Kelimeler</h2>
            <div className="space-y-4">
              {analysisData.fallingKeywords.map((keyword) => (
                <div key={keyword.name} className="flex justify-between items-center">
                  <span className="text-gray-700">{keyword.name}</span>
                  <span className="text-red-600 font-semibold">{keyword.traffic} trafik</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Karşılaştırmalı Trafik Detayları */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Karşılaştırmalı Trafik Detayları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 28 Günlük */}
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

            {/* 3 Aylık */}
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

            {/* 6 Aylık */}
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
        </div>
      </div>
    </Dashboardlayout>
  );
}

export default ProjectAnalysis; 