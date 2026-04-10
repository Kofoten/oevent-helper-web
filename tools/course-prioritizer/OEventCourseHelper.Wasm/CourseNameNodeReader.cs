using OEventCourseHelper.Core.Xml;
using System;
using System.Collections.Generic;
using System.Xml;

namespace OEventCourseHelper.Wasm;

public class CourseNameNodeReader : IXmlNodeReader
{
    private readonly List<string> courseNames = [];

    public Action<string> OnValidationError { get; set; }

    public string[] GetCourseNames() => [.. courseNames];

    public bool CanRead(XmlReader reader)
    {
        if (reader.NodeType != XmlNodeType.Element)
        {
            return false;
        }

        return reader.SchemaInfo?.SchemaType?.Name == "Course";
    }

    public void Read(XmlReader reader)
    {
        using var subReader = reader.ReadSubtree();
        while (subReader.Read())
        {
            if (subReader.NodeType != XmlNodeType.Element)
            {
                continue;
            }

            if (subReader.LocalName == "Name")
            {
                courseNames.Add(subReader.ReadElementContentAsString());
            }
        }
    }
}