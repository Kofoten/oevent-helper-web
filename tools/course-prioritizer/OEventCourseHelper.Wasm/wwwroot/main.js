import { dotnet } from './_framework/dotnet.js'

export function buildEngineResult(statusCode, errors, skippedControls, summaryStats, courseNames, requiredCount) {
    if (statusCode === 0) {
        return {
            success: true,
            summary: {
                totalCourseCount: summaryStats[0],
                requiredCourseCount: summaryStats[1],
                totalControlCount: summaryStats[2],
                visitedControlCount: summaryStats[3],
            },
            validationInfo: { skippedControls: skippedControls || [] },
            priorityOrder: courseNames.map((n, i) => ({
                courseName: n,
                required: i < requiredCount,
            })),
        }
    }

    let messages = errors;
    let resultType = "UnexpectedError";
    switch (statusCode) {
        case 1:
            resultType = "ParseStreamFailure";
            break;
        case 2:
            resultType = "ValidationFailure";
            messages = skippedControls.map(x => `Control ${x} could not be visited by any course.`);
            break;
        case 3:
            resultType = "NoSolutionFound";
            messages = `No course visited ${skippedControls.join(', ')}`;
            break;
    }
    
    return {
        success: false,
        error: {
            code: statusCode,
            type: resultType,
            messages: messages,
        } 
    }
}

window.initializeEngineAsync = async function initializeEngineAsync() {
    const { setModuleImports, getAssemblyExports, getConfig } = await dotnet.create();
    setModuleImports('main.js', { buildEngineResult });
    const config = getConfig();
    return await getAssemblyExports(config.mainAssemblyName);
}
