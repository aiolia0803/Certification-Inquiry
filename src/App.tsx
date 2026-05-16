import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, GraduationCap, Download, AlertCircle, X, CheckCircle2, School } from "lucide-react";
import { students, Student } from "./data/students";

export default function App() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [result, setResult] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const validateInputs = () => {
    if (!studentId || !studentName) {
      setError("請輸入完整的學號與姓名");
      return false;
    }
    if (!/^\d{6}$/.test(studentId)) {
      setError("學號必須為 6 位數字");
      return false;
    }
    return true;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsSearching(true);

    if (!validateInputs()) {
      setIsSearching(false);
      return;
    }

    // Simulate a brief delay for UX feel
    setTimeout(() => {
      const trimmedId = studentId.trim();
      const trimmedName = studentName.trim();

      // Special cases for absent students
      const absentStudents = [
        { id: "109031", name: "林尚靖" },
        { id: "109109", name: "郭琝澈" }
      ];

      if (absentStudents.some(s => s.id === trimmedId && s.name === trimmedName)) {
        setError("該學生因請假故無參與挑戰賽");
        setIsSearching(false);
        return;
      }

      const found = students.find(
        (s) => s.id === trimmedId && s.name === trimmedName
      );

      if (found) {
        setResult(found);
      } else {
        setError("查無資料，請確認學號與姓名是否正確");
      }
      setIsSearching(false);
    }, 600);
  };

  const resetSearch = () => {
    setStudentId("");
    setStudentName("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-100 italic-none">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-8 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <School className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
              114學年度福林國小
            </h1>
            <p className="text-lg font-medium text-blue-600">
              Bebras 運算思維學生電子證書查詢系統
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="search-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100"
            >
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  證書查詢
                </h2>
                <p className="text-neutral-500 text-sm">
                  請輸入孩子的學號及姓名以取得電子證書下載連結。
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="studentId" className="block text-sm font-medium text-neutral-700">
                    學生學號 (6位數字)
                  </label>
                  <div className="relative">
                    <input
                      id="studentId"
                      type="text"
                      inputMode="numeric"
                      placeholder="例如: 109999"
                      value={studentId}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setStudentId(val);
                      }}
                      className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-400 font-mono text-lg tracking-wider"
                      disabled={isSearching}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="studentName" className="block text-sm font-medium text-neutral-700">
                    學生姓名
                  </label>
                  <input
                    id="studentName"
                    type="text"
                    placeholder="例如: 杜福林"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-400 text-lg"
                    disabled={isSearching}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 overflow-hidden border border-red-100"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSearching}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isSearching
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]"
                  }`}
                >
                  {isSearching ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      查詢證書
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-3xl shadow-2xl shadow-blue-100 border border-blue-50 relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <GraduationCap className="w-32 h-32 text-blue-600 rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    已找到資料
                  </div>
                  <button
                    onClick={resetSearch}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center space-y-6 mb-10">
                  <div className="inline-block p-4 bg-blue-50 rounded-2xl mb-2">
                    <GraduationCap className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500 uppercase tracking-widest font-semibold">
                        學 生 姓名
                      </p>
                      <h3 className="text-4xl font-black text-neutral-900 tracking-tight">
                        {result.name}
                      </h3>
                    </div>
                    <div className="inline-flex items-center px-4 py-2 bg-neutral-50 rounded-lg border border-neutral-100 font-mono text-neutral-600">
                      學號：{result.id}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <Download className="w-6 h-6" />
                    下載電子證書
                  </a>
                  <button
                    onClick={resetSearch}
                    className="w-full py-4 text-neutral-500 font-medium hover:text-neutral-700 transition-colors"
                  >
                    返回查詢
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-neutral-400 text-sm">
          © 2026 福林國小
        </p>
        <p className="text-neutral-400 text-xs mt-1">
          系統開放查詢至115年6月30日止
        </p>
        <p className="text-neutral-400 text-xs mt-2 italic">
          本系統僅提供證書查詢，若資料有誤請洽資設組蔣老師(分機232)。
        </p>
      </footer>
    </div>
  );
}
