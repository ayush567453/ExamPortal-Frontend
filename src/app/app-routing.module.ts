import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryDashboardComponent } from './pages/library/dashboard/library-dashboard.component';
import { LibraryBooksComponent } from './pages/library/books/library-books.component';
import { LibraryMembersComponent } from './pages/library/members/library-members.component';
import { LibraryIssuesComponent } from './pages/library/issues/library-issues.component';
import { AddCategoryComponent } from './pages/admin/add-category/add-category.component';
import { AddQuestionComponent } from './pages/admin/add-question/add-question.component';
import { AddQuizComponent } from './pages/admin/add-quiz/add-quiz.component';

import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UpdateQuizComponent } from './pages/admin/update-quiz/update-quiz.component';
import { ViewCategoriesComponent } from './pages/admin/view-categories/view-categories.component';
import { ViewQuizQuestionsComponent } from './pages/admin/view-quiz-questions/view-quiz-questions.component';
import { ViewQuizzesComponent } from './pages/admin/view-quizzes/view-quizzes.component';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { InstructionsComponent } from './pages/user/instructions/instructions.component';
import { LoadQuizComponent } from './pages/user/load-quiz/load-quiz.component';
import { StartComponent } from './pages/user/start/start.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { AdminGuard } from './services/admin.guard';
import { NormalGuard } from './services/normal.guard';
import { QuizResultComponent } from './pages/admin/quiz-result/quiz-result.component';
import { ForgotpasswordComponent } from './pages/user/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './pages/user/reset-password/reset-password.component';
import { LeaderBoardComponent } from './pages/user/leader-board/leader-board.component';
import { SuperDashboardComponent } from './pages/super-admin/super-dashboard/super-dashboard.component';
import { TenantListComponent } from './pages/super-admin/tenant-list/tenant-list.component';
import { TenantFormComponent } from './pages/super-admin/tenant-form/tenant-form.component';
import { SchoolDashboardComponent } from './pages/school-admin/school-dashboard/school-dashboard.component';
import { StudentListComponent } from './pages/school-admin/student-list/student-list.component';
import { TeacherListComponent } from './pages/school-admin/teacher-list/teacher-list.component';
import { ClassesComponent } from './pages/school-admin/classes/classes.component';
import { TimetableComponent } from './pages/school-admin/timetable/timetable.component';
import { FeesComponent } from './pages/school-admin/fees/fees.component';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { SchoolAdminGuard } from './guards/school-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
  },
  {
    path: 'Leaderboard',
    component: LeaderBoardComponent,
    pathMatch: 'full',
  },
  {
path:'reset-password',
component:ResetPasswordComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
  path:'forget-password',
  component:ForgotpasswordComponent,
  pathMatch:'full',
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'categories',
        component: ViewCategoriesComponent,
      },
      {
        path: 'add-category',
        component: AddCategoryComponent,
      },
      {
        path: 'quizzes',
        component: ViewQuizzesComponent,
      },
      {
        path: 'add-quiz',
        component: AddQuizComponent,
      },
      
      {
        path: 'quiz/:qid',
        component: UpdateQuizComponent,
      },
      {
        path: 'quiz-result',
        component: QuizResultComponent,
      },
      {
        path: 'view-questions/:qid/:title',
        component: ViewQuizQuestionsComponent,
      },
      {
        path: 'add-question/:qid/:title',
        component: AddQuestionComponent,
      },
    ],
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [NormalGuard],
    children: [
      {
        path: ':catId',
        component: LoadQuizComponent,
      },
      {
        path: 'Leaderboard',
        component: LeaderBoardComponent,
      },
      {
        path: 'instructions/:qid',
        component: InstructionsComponent,
      },
    ],
  },
  {
    path: 'start/:qid',
    component: StartComponent,
    canActivate: [NormalGuard],
  },
  {
    path: 'super-admin',
    canActivate: [SuperAdminGuard],
    children: [
      { path: 'dashboard', component: SuperDashboardComponent },
      { path: 'tenants', component: TenantListComponent },
      { path: 'tenants/new', component: TenantFormComponent },
      { path: 'tenants/:id/edit', component: TenantFormComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'school-admin',
    canActivate: [SchoolAdminGuard],
    children: [
      { path: 'dashboard', component: SchoolDashboardComponent },
      { path: 'students', component: StudentListComponent },
      { path: 'teachers', component: TeacherListComponent },
      { path: 'classes', component: ClassesComponent },
      { path: 'timetable', component: TimetableComponent },
      { path: 'fees', component: FeesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'library',
    children: [
      { path: 'dashboard', component: LibraryDashboardComponent },
      { path: 'books',     component: LibraryBooksComponent },
      { path: 'members',   component: LibraryMembersComponent },
      { path: 'issues',    component: LibraryIssuesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
