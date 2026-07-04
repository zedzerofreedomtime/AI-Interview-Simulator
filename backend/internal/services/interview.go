package services

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/methasit/intervue-ai/backend/internal/ai"
	"github.com/methasit/intervue-ai/backend/internal/models"
	"github.com/methasit/intervue-ai/backend/internal/repositories"
)

var ErrQuestionNotFound = errors.New("interview question not found")

type InterviewService struct {
	repository repositories.InterviewRepository
	aiProvider ai.Provider
}

func NewInterviewService(
	repository repositories.InterviewRepository,
	aiProvider ai.Provider,
) *InterviewService {
	return &InterviewService{repository: repository, aiProvider: aiProvider}
}

func (service *InterviewService) Create(
	ctx context.Context,
	targetRole string,
	skills []string,
	count int,
	language string,
) (models.InterviewSession, error) {
	questions, err := service.aiProvider.GenerateQuestions(ctx, targetRole, skills, count, language)
	if err != nil {
		return models.InterviewSession{}, err
	}
	session := models.InterviewSession{
		ID:         uuid.NewString(),
		TargetRole: targetRole,
		Questions:  questions,
		CreatedAt:  time.Now().UTC(),
	}
	if err := service.repository.SaveInterviewSession(ctx, session); err != nil {
		return models.InterviewSession{}, err
	}
	return session, nil
}

func (service *InterviewService) Get(
	ctx context.Context,
	id string,
) (models.InterviewSession, error) {
	return service.repository.GetInterviewSession(ctx, id)
}

func (service *InterviewService) Evaluate(
	ctx context.Context,
	sessionID string,
	questionID string,
	answerText string,
	language string,
) (models.AnswerEvaluation, error) {
	session, err := service.repository.GetInterviewSession(ctx, sessionID)
	if err != nil {
		return models.AnswerEvaluation{}, err
	}

	var question models.InterviewQuestion
	found := false
	for _, item := range session.Questions {
		if item.ID == questionID {
			question = item
			found = true
			break
		}
	}
	if !found {
		return models.AnswerEvaluation{}, ErrQuestionNotFound
	}

	evaluation, err := service.aiProvider.EvaluateAnswer(ctx, question, answerText, language)
	if err != nil {
		return models.AnswerEvaluation{}, err
	}
	savedAnswer := models.InterviewAnswer{
		ID:         uuid.NewString(),
		SessionID:  sessionID,
		QuestionID: questionID,
		Answer:     answerText,
		Evaluation: evaluation,
		CreatedAt:  time.Now().UTC(),
	}
	if err := service.repository.SaveInterviewAnswer(ctx, savedAnswer); err != nil {
		return models.AnswerEvaluation{}, err
	}
	return evaluation, nil
}
