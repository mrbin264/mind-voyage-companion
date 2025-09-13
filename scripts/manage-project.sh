#!/bin/bash

# GitHub Project Field Management Script
# Usage: ./manage-project.sh [command] [options]

PROJECT_ID=4
OWNER="mrbin264"

# Helper function to display usage
show_help() {
    echo "GitHub Project Management Script"
    echo ""
    echo "USAGE:"
    echo "  ./manage-project.sh start-story <issue-number> <assignee>"
    echo "  ./manage-project.sh complete-story <issue-number>"
    echo "  ./manage-project.sh set-priority <issue-number> <priority>"
    echo "  ./manage-project.sh set-points <issue-number> <points>"
    echo "  ./manage-project.sh view-project"
    echo ""
    echo "EXAMPLES:"
    echo "  ./manage-project.sh start-story 1 mrbin264"
    echo "  ./manage-project.sh complete-story 1"  
    echo "  ./manage-project.sh set-priority 1 High"
    echo "  ./manage-project.sh set-points 1 8"
    echo ""
    echo "PRIORITY OPTIONS: Critical, High, Medium, Low"
    echo "STORY POINTS: 1, 2, 3, 5, 8, 13, 21, 34"
}

# Start working on a story
start_story() {
    local issue_number=$1
    local assignee=$2
    
    if [ -z "$issue_number" ] || [ -z "$assignee" ]; then
        echo "Error: Missing issue number or assignee"
        echo "Usage: ./manage-project.sh start-story <issue-number> <assignee>"
        exit 1
    fi
    
    echo "🚀 Starting work on issue #$issue_number..."
    
    # Assign the issue
    gh issue edit $issue_number --repo $OWNER/mind-voyage-companion --add-assignee $assignee
    
    echo "✅ Issue #$issue_number assigned to $assignee"
    echo "📝 Don't forget to:"
    echo "   1. Move status to 'In Progress' in the GitHub Project"
    echo "   2. Create feature branch: git checkout -b feature/mvc-$(printf "%03d" $issue_number)-description"
    echo "   3. Review docs/phase*/issues/MVC-$(printf "%03d" $issue_number)-*.md"
}

# Complete a story
complete_story() {
    local issue_number=$1
    
    if [ -z "$issue_number" ]; then
        echo "Error: Missing issue number"
        echo "Usage: ./manage-project.sh complete-story <issue-number>"
        exit 1
    fi
    
    echo "🎉 Completing story #$issue_number..."
    
    # Close the issue (this will automatically update project status)
    gh issue close $issue_number --repo $OWNER/mind-voyage-companion --comment "✅ Story completed! All acceptance criteria met and deployed to staging."
    
    echo "✅ Issue #$issue_number marked as complete"
    echo "📝 Don't forget to:"
    echo "   1. Clean up feature branch"
    echo "   2. Verify staging deployment"
    echo "   3. Update documentation if needed"
}

# Set story priority
set_priority() {
    local issue_number=$1
    local priority=$2
    
    if [ -z "$issue_number" ] || [ -z "$priority" ]; then
        echo "Error: Missing issue number or priority"
        echo "Usage: ./manage-project.sh set-priority <issue-number> <priority>"
        echo "Priority options: Critical, High, Medium, Low"
        exit 1
    fi
    
    # Add priority label
    gh issue edit $issue_number --repo $OWNER/mind-voyage-companion --add-label "priority: $priority"
    
    echo "✅ Issue #$issue_number priority set to $priority"
}

# Set story points
set_points() {
    local issue_number=$1
    local points=$2
    
    if [ -z "$issue_number" ] || [ -z "$points" ]; then
        echo "Error: Missing issue number or story points"
        echo "Usage: ./manage-project.sh set-points <issue-number> <points>"
        exit 1
    fi
    
    # Add story points as a comment for tracking
    gh issue comment $issue_number --repo $OWNER/mind-voyage-companion --body "📊 **Story Points**: $points

This issue is estimated at $points story points based on complexity and effort required."
    
    echo "✅ Issue #$issue_number story points set to $points"
}

# View project status
view_project() {
    echo "📊 Mind Voyage Companion Project Status:"
    echo ""
    gh project view $PROJECT_ID --owner $OWNER
    echo ""
    echo "🔗 Project URL: https://github.com/users/$OWNER/projects/$PROJECT_ID"
}

# Main script logic
case "$1" in
    "start-story")
        start_story "$2" "$3"
        ;;
    "complete-story")
        complete_story "$2"
        ;;
    "set-priority")
        set_priority "$2" "$3"
        ;;
    "set-points")
        set_points "$2" "$3"
        ;;
    "view-project")
        view_project
        ;;
    "help"|"-h"|"--help"|"")
        show_help
        ;;
    *)
        echo "Error: Unknown command '$1'"
        echo ""
        show_help
        exit 1
        ;;
esac