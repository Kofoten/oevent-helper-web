using OEventCourseHelper.Core.Xml.Iof;
using System.IO;
using System.Runtime.InteropServices.JavaScript;

namespace OEventCourseHelper.Wasm;

public partial class CourseListBridge
{
    [JSExport]
    public static string[] GetCourseNames(byte[] iofXmlBytes)
    {
        var nodeReader = new CourseNameNodeReader();
        using (var stream = new MemoryStream(iofXmlBytes))
        using (var reader = IOFXmlReader.Create(stream, nodeReader))
        {
            if (!reader.TryStream())
            {
                return [];
            }
        }

        return nodeReader.GetCourseNames();
    }
}