package repositories

import (
	"context"
	"errors"
	"sync"

	"github.com/methasit/intervue-ai/backend/internal/models"
)

var ErrNotFound = errors.New("resource not found")

type MemoryStore struct {
	mu        sync.RWMutex
	resumes   map[string]models.ResumeAnalysis
	sessions  map[string]models.InterviewSession
	answers   map[string]models.InterviewAnswer
	dashboard models.Dashboard
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		resumes:   make(map[string]models.ResumeAnalysis),
		sessions:  make(map[string]models.InterviewSession),
		answers:   make(map[string]models.InterviewAnswer),
		dashboard: seedDashboard(),
	}
}

func (store *MemoryStore) GetDashboard(context.Context) (models.Dashboard, error) {
	store.mu.RLock()
	defer store.mu.RUnlock()
	return store.dashboard, nil
}

func (store *MemoryStore) SaveResumeAnalysis(
	_ context.Context,
	analysis models.ResumeAnalysis,
) error {
	store.mu.Lock()
	defer store.mu.Unlock()
	store.resumes[analysis.ID] = analysis
	store.dashboard.CandidateProfile = analysis.CandidateProfile
	store.dashboard.GreetingName = analysis.CandidateProfile.Name
	store.dashboard.TargetRole = analysis.CandidateProfile.Career
	return nil
}

func (store *MemoryStore) SaveInterviewSession(
	_ context.Context,
	session models.InterviewSession,
) error {
	store.mu.Lock()
	defer store.mu.Unlock()
	store.sessions[session.ID] = session
	return nil
}

func (store *MemoryStore) GetInterviewSession(
	_ context.Context,
	id string,
) (models.InterviewSession, error) {
	store.mu.RLock()
	defer store.mu.RUnlock()
	session, ok := store.sessions[id]
	if !ok {
		return models.InterviewSession{}, ErrNotFound
	}
	return session, nil
}

func (store *MemoryStore) SaveInterviewAnswer(
	_ context.Context,
	answer models.InterviewAnswer,
) error {
	store.mu.Lock()
	defer store.mu.Unlock()
	store.answers[answer.ID] = answer
	return nil
}

func seedDashboard() models.Dashboard {
	return models.Dashboard{
		GreetingName: "Methasit",
		Readiness:    78,
		TargetRole:   "Backend Developer",
		CandidateProfile: models.CandidateProfile{
			Name:            "Methasit",
			Career:          "Backend Developer",
			ExperienceLevel: "Junior",
			Skills:          []string{"Go", "React", "PostgreSQL", "Redis"},
			MissingSkills:   []string{"Docker", "CI/CD", "Testing"},
		},
		RecentInterviews: []models.InterviewSummary{
			{ID: "int-1", Date: "May 12, 2026", Role: "Backend Developer", Duration: "45m", Score: 78, Topics: []string{"Go", "SQL", "System Design"}, Result: "Good"},
			{ID: "int-2", Date: "May 10, 2026", Role: "Backend Developer", Duration: "50m", Score: 65, Topics: []string{"API Design", "PostgreSQL"}, Result: "Average"},
			{ID: "int-3", Date: "May 7, 2026", Role: "Backend Developer", Duration: "40m", Score: 82, Topics: []string{"Go", "Redis", "Concurrency"}, Result: "Good"},
			{ID: "int-4", Date: "May 4, 2026", Role: "Backend Developer", Duration: "35m", Score: 58, Topics: []string{"Data Structures", "SQL"}, Result: "Needs work"},
		},
		Roadmap: []models.RoadmapItem{
			{Week: 1, Title: "Docker", Description: "Package a Go API and learn the container workflow.", Hours: 6, Outcomes: []string{"Write a Dockerfile", "Use Docker Compose"}},
			{Week: 2, Title: "GitHub Actions", Description: "Build a small CI pipeline for the project.", Hours: 5, Outcomes: []string{"Run tests in CI", "Build container images"}},
			{Week: 3, Title: "Unit Testing", Description: "Practice table-driven tests and service isolation.", Hours: 7, Outcomes: []string{"Test Go services", "Mock repositories"}},
			{Week: 4, Title: "Deployment", Description: "Deploy the stack and learn production configuration.", Hours: 6, Outcomes: []string{"Manage environment config", "Add health checks"}},
		},
	}
}
