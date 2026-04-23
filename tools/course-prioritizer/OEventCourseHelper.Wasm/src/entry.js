import CoursePrioritizer from './course-prioritizer.svelte';

export function mountCoursePrioritizer(targetElement, props) {
    return new CoursePrioritizer({
        target: targetElement,
        props: props
    });
}