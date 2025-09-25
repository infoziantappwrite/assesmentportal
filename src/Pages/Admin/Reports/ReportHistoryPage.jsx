import React, { useEffect, useState } from "react";
import { getExportHistory, downloadReport } from "../../../Controllers/reportsController";
import {
    FileText,
    Clock4,
    Download,
    Loader2,
    XCircle,
    CheckCircle2,
    RefreshCw,
    AlertTriangle
} from "lucide-react";

const ReportHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await getExportHistory();
            setHistory(data?.data?.exports || []);
        } catch (error) {
            console.error("Failed to load report history:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const formatDateTime = (dateStr) =>
        dateStr ? new Date(dateStr).toLocaleString() : "—";

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-800";
            case "failed": return "bg-red-100 text-red-800";
            default: return "bg-yellow-100 text-yellow-800";
        }
    };

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="text-indigo-600 w-6 h-6" />
            <span>Report Export History</span>
          </h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
            <span className="text-gray-600">Loading report history...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <FileText className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No reports generated yet
            </h3>
            <p className="text-gray-500">
              Your exported reports will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => {
              const {
                _id,
                report_type,
                export_type,
                name,
                requested_at,
                completed_at,
                downloaded_at,
                file_info,
                processing,
              } = entry;

              const isCompleted = processing?.status === "completed";
              const isFailed = processing?.status === "failed";
              const canDownload = isCompleted && file_info?.file_path;
              const isExpired =
                file_info?.expires_at &&
                new Date() > new Date(file_info.expires_at);

              return (
                <div
                  key={_id}
                  className="border border-gray-200 rounded-xl bg-white p-5 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {file_info?.file_name
                            ?.replace(/_/g, " ")
                            .split(".")[0] || report_type}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 text-xs rounded-full ${getStatusColor(
                            processing?.status
                          )} font-medium`}
                        >
                          {processing?.status || "pending"}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 font-medium uppercase">
                          {export_type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock4 className="w-3.5 h-3.5 text-gray-400" />
                          <span>Requested: {formatDateTime(requested_at)}</span>
                        </div>

                        {isCompleted && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            <span>
                              Completed: {formatDateTime(completed_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      {isCompleted && (
                        <div className="pt-1">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span>Size: {file_info?.file_size_mb ?? 0} MB</span>
                            <span>
                              Expires: {formatDateTime(file_info?.expires_at)}
                            </span>
                            {downloaded_at && (
                              <span className="flex items-center gap-1 text-blue-500">
                                <Download className="w-3 h-3" />
                                Downloaded: {formatDateTime(downloaded_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {isFailed && (
                        <div className="flex items-start gap-2 mt-1 p-2 bg-red-50 rounded text-red-700 text-sm">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            {processing?.error_message ||
                              "Report generation failed"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-col items-end gap-2">
                      {canDownload ? (
                        <>
                          {isExpired ? (
                            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                              File expired
                            </span>
                          ) : (
                            <button
                              onClick={async () => {
                                try {
                                  await downloadReport(_id, file_info?.file_name);
                                  // Refresh history to show download timestamp
                                  const data = await getExportHistory();
                                  setHistory(data?.data?.exports || []);
                                } catch (error) {
                                  alert(
                                    error.message || "Failed to download report"
                                  );
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          )}
                        </>
                      ) : isFailed ? (
                        <div className="flex items-center gap-2 text-red-600 px-3 py-1.5">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Failed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 px-3 py-1.5">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm font-medium">
                            Processing
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
};

export default ReportHistoryPage;