using OEventCourseHelper.Core.CoursePrioritizer;
using System;
using System.IO;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace OEventHelperWeb;

public record UnexpectedError(string ErrorMessage);

[JsonSerializable(typeof(CoursePrioritizerResult))]
[JsonSerializable(typeof(UnexpectedError))]
public partial class EngineJsonContext : JsonSerializerContext
{
}

public partial class EngineBridge
{
    [JSExport]
    public static string Prioritize(byte[] iofXmlBytes, int beamWidth, bool strict, string[] filter)
    {
        try
        {
            var engine = new CoursePrioritizerEngine(beamWidth, strict, filter);

            CoursePrioritizerResult result;
            using (var stream = new MemoryStream(iofXmlBytes))
            {
                result = engine.Run(stream);
            }

            return JsonSerializer.Serialize(result, EngineJsonContext.Default.CoursePrioritizerResult);
        }
        catch (Exception ex)
        {
            var error = new UnexpectedError(ex.Message);
            return JsonSerializer.Serialize(error, EngineJsonContext.Default.UnexpectedError);
        }
    }
}
