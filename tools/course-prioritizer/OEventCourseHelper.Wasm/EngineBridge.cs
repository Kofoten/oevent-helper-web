using OEventCourseHelper.Core.CoursePrioritizer;
using System;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;

namespace OEventCourseHelper.Wasm;

public partial class EngineBridge
{
    [JSImport("buildEngineResult", "main.js")]
    internal static partial JSObject BuildEngineResult(
        int statusCode,
        string[] errors,
        string[] skippedControls,
        int[] summaryStats,
        string[] courseNames,
        int requiredCount);

    [JSExport]
    public static JSObject Prioritize(byte[] iofXmlBytes, int beamWidth, bool strict, string[] filter)
    {
        try
        {
            var engine = new CoursePrioritizerEngine(beamWidth, strict, filter);

            CoursePrioritizerResult result;
            using (var stream = new MemoryStream(iofXmlBytes))
            {
                result = engine.Run(stream);
            }

            return result switch
            {
                CoursePrioritizerResult.Success s => BuildEngineResult(
                    statusCode: 0,
                    errors: [],
                    skippedControls: [.. s.ValidationInfo.SkippedControls],
                    summaryStats: [
                        s.Summary.TotalCourseCount,
                        s.Summary.RequiredCourseCount,
                        s.Summary.TotalControlCount,
                        s.Summary.VisitedControlCount
                    ],
                    courseNames: [.. s.PriorityOrder.Select(x => x.CourseName)],
                    requiredCount: s.Summary.RequiredCourseCount),
                CoursePrioritizerResult.ParseStreamFailure f => BuildEngineResult(
                    1, [.. f.Errors], [], [0, 0, 0, 0], [], 0),
                CoursePrioritizerResult.ValidationFailure f => BuildEngineResult(
                    2, [], [.. f.ValidationInfo.SkippedControls], [0, 0, 0, 0], [], 0),
                CoursePrioritizerResult.NoSolutionFound f => BuildEngineResult(
                    3, [], [.. f.ValidationInfo.SkippedControls], [0, 0, 0, 0], [], 0),
                _ => BuildEngineResult(42, ["Unknown result type"], [], [0, 0, 0, 0], [], 0),
            };
        }
        catch (Exception ex)
        {
            return BuildEngineResult(42, [ex.Message], [], [0, 0, 0, 0], [], 0);
        }
    }
}
