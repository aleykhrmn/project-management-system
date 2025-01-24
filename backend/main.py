import logging
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pyodbc
from datetime import datetime
from typing import List  # Veritabanı döndürülen listeyi belirtmek için
from datetime import datetime  # datetime modülünü import etmelisiniz

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # veya ["http://localhost:3000"] frontend'inizin bulunduğu adres
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Veritabanı bağlantısı
cnxn = pyodbc.connect("Driver={SQL Server Native Client 11.0};"
                      "Server=DESKTOP-VMO3C7M\SQLEXPRESS;"
                      "Database=PYS;"
                      "Trusted_Connection=yes;")
cursor = cnxn.cursor()

# Kullanıcı bilgilerini döndüren bir yapı
class User(BaseModel):
    username: str
    password: str
    email: str
    is_admin: bool = False  # Varsayılan olarak False (yönetici değil)

# Giriş yapan kullanıcıyı saklamak için geçici bir yapı
current_user = None  # Giriş yapan kullanıcıyı buraya saklayacağız.

@app.post("/register")
async def register_user(user: User):
    cursor.execute("""
        INSERT INTO Users (username, password, email, is_admin) 
        VALUES (?, ?, ?, ?)
    """, user.username, user.password, user.email, user.is_admin)
    cnxn.commit()

    return {"message": "Kullanıcı başarıyla kaydedildi."}

@app.post("/login")
async def login_user(user: User):
    cursor.execute("SELECT id, username, email, password, is_admin FROM Users WHERE email = ?", user.email)
    row = cursor.fetchone()

    if row is None:
        raise HTTPException(status_code=400, detail="Kullanıcı bulunamadı")

    db_password = row[3]  # Veritabanındaki şifre (4. sütun)
    if user.password != db_password:  # Şifreyi kontrol ediyoruz
        raise HTTPException(status_code=400, detail="Yanlış şifre")

    user_id = row[0]  # id sütunu (1. sütun)
    username = row[1]  # Kullanıcı adı (2. sütun)
    is_admin = row[4]  # Admin durumu (5. sütun)
    
    global current_user
    current_user = {"id": user_id, "username": username, "email": row[2], "is_admin": is_admin}  # Kullanıcı bilgilerini tutuyoruz

    # Kullanıcı adını ve id'yi konsola yazdırıyoruz
    print(f"Giriş yapan kullanıcı: {current_user['username']} (ID: {current_user['id']})")

    return {
        "message": "Giriş başarılı.",
        "username": username,  # Kullanıcı adını döndürüyoruz
        "user_id": user_id,  # Kullanıcı ID'sini döndürüyoruz
        "is_admin": is_admin
    }

@app.get("/get-user-role")
async def get_user_role():
    # Eğer giriş yapılmamışsa hata döndür
    if current_user is None:
        raise HTTPException(status_code=401, detail="Kullanıcı giriş yapmadı")

    # Giriş yapan kullanıcının admin olup olmadığını kontrol ediyoruz
    is_admin = current_user["is_admin"]
    return {"is_admin": is_admin}  # Kullanıcının rolü döndürülür


@app.post("/logout")
async def logout_user():
    global current_user
    current_user = None  # Kullanıcıyı çıkartıyoruz
    return {"message": "Çıkış yapıldı."}


class Project(BaseModel):
    id: int
    name: str
    description: str
    start_date: datetime
    end_date: datetime
    status: str

    class Config:
        orm_mode = True  # SQLAlchemy modelini Pydantic modeline dönüştürme

@app.get("/projects")
async def get_projects():
    cursor.execute("SELECT project_id, project_name, description, start_date, end_date, status FROM Projects")
    projects = cursor.fetchall()

    return [
        {
            "id": project[0],
            "name": project[1],
            "description": project[2],
            "start_date": project[3].strftime('%Y-%m-%d') if project[3] else None,
            "end_date": project[4].strftime('%Y-%m-%d') if project[4] else None,
            "status": project[5]
        }
        for project in projects
    ]


# Görev bilgilerini döndüren bir yapı
class Task(BaseModel):
    task_name: str
    description: str = None
    assigned_to: int
    due_date: datetime
    priority: str
    status: str
    project_id: int

    class Config:
        orm_mode = True

# Görev eklemek için bir endpoint
@app.post("/tasks")
async def create_task(task: Task):
    cursor.execute("""
        INSERT INTO Tasks (task_name, description, assigned_to, due_date, priority, status, project_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, task.task_name, task.description, task.assigned_to, task.due_date, task.priority, task.status, task.project_id)
    cnxn.commit()
    return {"message": "Görev başarıyla oluşturuldu."}

# Tüm görevleri listelemek için bir endpoint
@app.get("/tasks")
async def get_tasks():
    cursor.execute("SELECT task_id, task_name, description, assigned_to, due_date, priority, status, project_id FROM Tasks")
    tasks = cursor.fetchall()

    return [
        {
            "task_id": task[0],
            "task_name": task[1],
            "description": task[2],
            "assigned_to": task[3],
            "due_date": task[4].strftime('%Y-%m-%d') if task[4] else None,
            "priority": task[5],
            "status": task[6],
            "project_id": task[7]
        }
        for task in tasks
    ]

# Görev güncellemek için bir endpoint
@app.put("/tasks/{task_id}")
async def update_task(task_id: int, task: Task):
    cursor.execute("""
        UPDATE Tasks
        SET task_name = ?, description = ?, assigned_to = ?, due_date = ?, priority = ?, status = ?, project_id = ?
        WHERE task_id = ?
    """, task.task_name, task.description, task.assigned_to, task.due_date, task.priority, task.status, task.project_id, task_id)
    cnxn.commit()
    return {"message": f"Görev ID {task_id} başarıyla güncellendi."}

# Görev silmek için bir endpoint
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    cursor.execute("DELETE FROM Tasks WHERE task_id = ?", task_id)
    cnxn.commit()
    return {"message": f"Görev ID {task_id} başarıyla silindi."}


# Member ve Team için modeller
class MemberInfo(BaseModel):
    username: str
    role: str

class TeamInfo(BaseModel):
    team_name: str
    project_name: str
    members: List[MemberInfo]

@app.get("/teams", response_model=List[TeamInfo])
async def get_teams():
    cursor.execute("""
        SELECT 
            t.team_name,
            p.project_name,
            u.username,
            tm.role
        FROM 
            Teams t
        JOIN 
            TeamMembers tm ON t.team_id = tm.team_id
        JOIN 
            Users u ON tm.user_id = u.id
        JOIN 
            Projects p ON t.project_id = p.project_id
    """)
    teams_data = cursor.fetchall()

    # Takımları gruplamak ve üyeleri listelemek için bir yapı kuruyoruz
    team_dict = {}
    for team in teams_data:
        team_name = team[0]
        project_name = team[1]
        username = team[2]
        role = team[3]

        if team_name not in team_dict:
            team_dict[team_name] = {
                "team_name": team_name,
                "project_name": project_name,
                "members": []
            }
        team_dict[team_name]["members"].append({
            "username": username,
            "role": role
        })

    # Veri yapısını listeye çeviriyoruz
    return list(team_dict.values())


# Kullanıcı bilgilerini listelemek için bir endpoint
@app.get("/users")
async def get_users():
    cursor.execute("SELECT id, username, email, is_admin FROM Users")
    users = cursor.fetchall()

    return [
        {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "is_admin": user[3]
        }
        for user in users
    ]

# Belirli bir kullanıcının görevlerini listelemek için bir endpoint
@app.get("/users/{user_id}/tasks")
async def get_user_tasks(user_id: int):
    cursor.execute("""
        SELECT 
            task_id, task_name, description, due_date, priority, status, project_id
        FROM 
            Tasks
        WHERE 
            assigned_to = ?
    """, user_id)
    tasks = cursor.fetchall()

    return [
        {
            "task_id": task[0],
            "task_name": task[1],
            "description": task[2],
            "due_date": task[3].strftime('%Y-%m-%d') if task[3] else None,
            "priority": task[4],
            "status": task[5],
            "project_id": task[6]
        }
        for task in tasks
    ]

# Belirli bir kullanıcının projelerdeki rollerini listelemek için bir endpoint
@app.get("/users/{user_id}/projects")
async def get_user_projects(user_id: int):
    cursor.execute("""
        SELECT 
            p.project_name, 
            tm.role 
        FROM 
            Users u
        JOIN 
            TeamMembers tm ON u.id = tm.user_id
        JOIN 
            Teams t ON tm.team_id = t.team_id
        JOIN 
            Projects p ON t.project_id = p.project_id
        WHERE 
            u.id = ?
    """, user_id)
    projects = cursor.fetchall()

    return [
        {
            "projectName": project[0],
            "role": project[1]
        }
        for project in projects
    ]
