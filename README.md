# **Seamless**

### **간편하고 직관적인 협업 툴**
Notion, Trello와 같은 기존 협업 툴의 복잡함을 해소하고, 간편한 협업 환경을 제공하는 프로젝트입니다.  
**로그인 없이 참여 코드**로 간단히 참여하며, 협업의 진입 장벽을 낮추었습니다.  
게이미피케이션 요소를 활용하여 동기부여를 제공합니다.

---

## **📌 테스트 계정**

- **Google 테스트 계정**: `kakaotechcampus.mentor@gmail.com`

---

## **📖 목차**

- [Seamless란?](#seamless란)
- [사용법](#사용법)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [폴더 구조](#폴더-구조)
- [ERD](#erd)
- [협업 전략](#협업-전략)
- [구현 기능](#구현-기능)
- [Technical Issue와 해결과정](#technical-issue와-해결과정)
- [협업 이슈 해결](#협업-이슈-해결)
- [배포 주소](#배포-주소)

---

## **💡 Seamless란?**

**Seamless**는 복잡한 협업 툴의 대안을 제시합니다.
- **간단한 참여 과정**: 로그인 없이 **참여 코드**만으로 프로젝트 참여.
- **게이미피케이션 요소**: 동기부여를 위한 다양한 기능 탑재.
- **직관적인 인터페이스**: 복잡한 기능은 배제하고, 필요한 핵심 기능만 제공합니다.

### **경쟁력**
- **간편한 참여**: 별도의 계정 생성 없이 참여 가능.
- **프로젝트 중심의 협업**: 프로젝트 관리와 진행도를 한눈에 확인.

---

## **🚀 사용법**

1. **팀장**
    - 프로젝트를 생성하고, **어텐드 링크**를 통해 팀원을 초대.
    - 팀원 초대 시, 링크를 통해 팀원이 정보를 입력하고 **참여 코드**를 이메일로 전달받도록 설정.

2. **팀원**
    - 팀장이 공유한 어텐드 링크에 접속해 이름과 이메일을 입력.
    - 받은 **참여 코드**로 프로젝트에 로그인 없이 참여.
    - 프로젝트 내 **진행 상황과 개인 태스크**를 확인 및 관리.

👉 [자세한 사용법 링크](https://github.com/kakao-tech-campus-2nd-step3/Team1_BE/wiki/%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%EC%82%AC%EC%9A%A9%EB%B2%95)

### **예시 화면**
1. **랜딩 페이지**  
   ![랜딩 페이지](https://github.com/user-attachments/assets/070052c6-333d-49bc-8b6f-b272de5a8a9f)

2. **로그인 UI**  
   ![로그인 UI](https://github.com/user-attachments/assets/3d3e342e-7021-46da-8b40-fc1cf864edfc)

3. **프로젝트 참여 화면**  
   ![프로젝트 참여](https://github.com/user-attachments/assets/bf635f6c-299b-4f6c-9c7e-30a763ecd85f)

### **프로토타입**
👉 [프로토타입 확인](https://www.figma.com/design/ZhOOxxb7yLfcJORzvXLFjh)

---

## **🔧 기술 스택**

### **Frontend**
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)  
**Tools:** NPM, TypeScript, Storybook, Webpack, ESLint

### **Backend**
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)  
**Tools:** Hibernate, Spring Security, Gmail API, Swagger, JPA

### **Deployment**
![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

---

## **🛠️ 프로젝트 구조**

![프로젝트 구조도](https://github.com/user-attachments/assets/2bc76c2c-ac20-4d67-b746-f4fa2b064cec)
👉 [아키텍처 설명 링크](https://github.com/kakao-tech-campus-2nd-step3/Team1_BE/wiki/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9E%90%EC%84%B8%ED%95%9C-%EC%84%A4%EB%AA%85)
---
## **🛠️ 폴더 구조**

```bash
├── public/               # 정적 파일
├── src/                 # 소스 코드
│   ├── api/            # API 관련 함수 및 설정
│   ├── assets/         # 정적 자산 (이미지, 폰트 등)
│   ├── components/     # 재사용 가능한 React 컴포넌트
│   ├── mocks/         # 개발/테스트용 더미 데이터
│   ├── pages/         # 페이지 컴포넌트/라우트
│   ├── provider/      # React context 제공자
│   ├── routes/        # 라우트 설정
│   ├── types/         # TypeScript 타입 정의
│   ├── utils/         # 유틸리티 함수
│   ├── App.tsx        # 루트 애플리케이션 컴포넌트
│   ├── env.d.ts       # 환경 변수 타입 정의
│   └── index.tsx      # 애플리케이션 진입점

```
---

## **📊 ERD**

![ERD](https://github.com/user-attachments/assets/fcac1f9b-2f0f-4276-9481-47748648e7bf)
👉 [ERD 설명 링크](https://github.com/kakao-tech-campus-2nd-step3/Team1_BE/wiki/ERD-%EC%84%A4%EB%AA%85)
---

## **🤝 협업 전략**

### **Branch 전략**
- **Weekly Branch**: 각자 주별 브랜치 pull 후 작업.
- **Pull Request**: Weekly → Develop → Master 순으로 PR.
- **CI/CD**: Develop 브랜치를 통해 자동 배포.

### **Commit 규칙** (Angular 스타일)
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- **자세한 규칙:** 👉 [Commit 규칙](https://quickest-asterisk-75d.notion.site/P2P-d38e691fbcbb4a719274fb91e48f91cd?p=1d0fac986a2e48e5a4152524214084e7&pm=s)

### **API 입출력 규칙**
👉 [API 문서 링크](https://quickest-asterisk-75d.notion.site/P2P-d38e691fbcbb4a719274fb91e48f91cd?p=905fd6f9a8a140178580b5fd9593e0fe&pm=s)

---

## **✨ 구현 기능**

✨ 구현 기능
- 랜딩 페이지

서비스 소개와 주요 기능 설명
"Faster, Simple Team Work For Free!" 메시지 강조
협업 현장을 보여주는 이미지 구현

- 로그인 UI

심플하고 직관적인 로그인 인터페이스
프로젝트 참여 코드 입력 폼
사용자 친화적인 디자인

- 프로젝트 참여 화면

간편한 프로젝트 참여 프로세스
코드 입력 후 즉시 접근 가능
프로젝트 기본 정보 표시

- 프로젝트 참여/관리

프로젝트 진행도 시각화
태스크별 상태 표시 및 관리
프로젝트 멤버 관리 기능

- 프로젝트 대시보드

프로젝트 전체 진행 상황 한눈에 파악
개인별 태스크 관리 및 진행도 표시
직관적인 차트와 그래프로 정보 제공

---

## **🤝 협업 이슈 해결**

- **노션**을 통해 프론트 트랙과의 이슈 해결.
- **문제 해결 예시**
![스크린샷 2024-11-12 194745](https://github.com/user-attachments/assets/c57ea804-562c-4855-bb28-29feaedf55c3)
![스크린샷 2024-11-12 194841](https://github.com/user-attachments/assets/8e61bab5-a27f-4251-a3fa-e51dd098e4f4)
👉 [자세한 협업 과정 링크](https://polar-yellowhorn-1cd.notion.site/Swagger-241107-137a2fbcb2b180a0a67cf6906ab83ab8)

---

## **🌐 배포 주소**

- **백엔드:** [Backend URL](https://seamlessup.com)
- **프론트엔드:** [Frontend URL](https://team1-fe-test.vercel.app/)
- **Frontend GitHub:** [프론트엔드 깃허브](https://github.com/kakao-tech-campus-2nd-step3/Team1_FE)
