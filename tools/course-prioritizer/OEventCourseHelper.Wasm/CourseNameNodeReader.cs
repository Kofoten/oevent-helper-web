public class CourseNameNodeReader : IXmlNodeReader
{
    private const string Namespace = "http://www.orienteering.org/datastandard/3.0";
    
    private const string CourseElementName = "Course";
    private const string CourseElementSchemaType = "Course";

    private readonly List<string> courseNames = [];

    public ImmutableArray<string> GetCourseNames() => courseNames.ToImmutableArray();

    public bool CanRead(XmlReader reader)
    {
        if (reader.NodeType != XmlNodeType.Element)
        {
            return false;
        }

        return  reader.SchemaInfo?.SchemaType?.Name == CourseElementSchemaType;
    }

    private void ReadCourse(XmlReader reader)
    {
        using var subReader = reader.ReadSubtree();
        var deserializedObject = courseSerializer.Deserialize(subReader);

        if (deserializedObject is IOF.Xml.Course iofCourse)
        {
            courseNames.Add(iofCourse.Name);
        }
    }
}