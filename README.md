# 📄 README.md (Kiosk 프로젝트 배포 전체 순서)

---

# ✅ Kiosk 프로젝트 배포 전체 순서

> 프론트에드와 백어론데 서버를 분리하여 MobaXterm 세션 2개로 관리합니다.

---

# 1. MobaXterm 세션 2개 만들기

- MobaXterm 시작
- Session → SSH → Remote host: `3.38.6.220`
- Username: `ubuntu`
- Private Key: `/c/kiosk-backend/pem/LightsailDefaultKey-ap-northeast-2.pem`
- → 각각 '백엔드', '프론트엔드' 이름으로 세션 생성

✅ 백엔드 세션, 프론트 세션 각각 다른 창에 연결

---

# 2. 프론트에드 빌드 및 업로드

## 2.1 프론트에드 빌드 (로컬 PC)

```bash
cd C:\kiosk-frontend
npm run build
```
✅ `dist/` 폴더 생성 확인

---

## 2.2 프론트에드 서버로 업로드 (로컬 → 서버)

```bash
scp -i /c/kiosk-backend/pem/LightsailDefaultKey-ap-northeast-2.pem -r dist/* ubuntu@3.38.6.220:/var/www/html/
```

| 출발지 | 목적지 |
|:---|:---|
| 로컬 | `C:\kiosk-frontend\dist\*` |
| 서버 | `/var/www/html/` |

✅ 프론트 파일 서버 업로드 완료

---

# 3. 백엔드 빌드 및 업로드

## 3.1 백엔드 빌드 (로컬 PC)

```bash
cd C:\kiosk-backend
./gradlew clean build
```
✅ `build/libs/kiosk-app-0.0.1-SNAPSHOT.jar` 생성 확인

---

## 3.2 백엔드 서버로 업로드

**방법 1: 드래그 복사**
- 로컬: `C:\kiosk-backend\build\libs\kiosk-app-0.0.1-SNAPSHOT.jar`
- 서버: `/home/ubuntu/kiosk-system/`

**방법 2: 명령어 복사**

```bash
scp -i /c/kiosk-backend/pem/LightsailDefaultKey-ap-northeast-2.pem build/libs/kiosk-app-0.0.1-SNAPSHOT.jar ubuntu@3.38.6.220:/home/ubuntu/kiosk-system/
```

✅ 백엔드 .jar 서버 업로드 완료

---

# 4. 백엔드 서버 재시작

## 4.1 서버 접속 (백엔드 세션)

```bash
ssh -i /c/kiosk-backend/pem/LightsailDefaultKey-ap-northeast-2.pem ubuntu@3.38.6.220
```

---

## 4.2 기존 서버 종료

```bash
ps -ef | grep java
kill -9 (PID)
```
✅ 기존 백엔드 서버 종료 완료

---

## 4.3 새 서버 실행

```bash
cd ~/kiosk-system
nohup java -jar kiosk-app-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

또는:

```bash
java -jar kiosk-app-0.0.1-SNAPSHOT.jar
```

(※ nohup 없이 통재하면 터미널 닫으면 서버 움직이지 않음)

✅ 새 서버 실행 완료

---

# ✅ 전체 경로 정리

| 구루 | 로컬 경로 | 서버 경로 |
|:---|:---|:---|
| 프론트 dist/ | `C:\kiosk-frontend\dist\*` | `/var/www/html/` |
| 백엔드 .jar | `C:\kiosk-backend\build\libs\kiosk-app-0.0.1-SNAPSHOT.jar` | `/home/ubuntu/kiosk-system/` |

---

# ✅ 최종 순서 요약

1. MobaXterm 세션 2개 연결
2. 프론트엔드 빌드 (`npm run build`)
3. 프론트 서버 업로드 (`scp dist/*`)
4. 백엔드 빌드 (`./gradlew clean build`)
5. 백엔드 서버 업로드 (드래그 or scp)
6. 기존 서버 종료 (`kill -9 PID`)
7. 새 서버 실행 (`nohup java -jar ...`)

---

# 📢 주의사항

- .jar 파일 이름 바뀌면 실행명령도 같이 바꿀 것
- 프론트 업로드 후 nginx 문제 생기면 `sudo systemctl restart nginx` 필요할 수도 있음

---

