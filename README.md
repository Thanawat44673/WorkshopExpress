# WorkshopExpress

REST API สำหรับจัดการผู้ใช้ ร้านค้า สินค้า และคำสั่งซื้อ พัฒนาด้วย Node.js, Express และ MongoDB ผ่าน Mongoose รองรับการยืนยันตัวตนด้วย JWT และการอัปโหลดรูปสินค้า

## ความสามารถ

- สมัครและเข้าสู่ระบบด้วย username/password
- บัญชีใหม่รอ Admin อนุมัติก่อนจึงใช้งาน API ที่ต้องยืนยันตัวตนได้
- จัดการคำขอสมาชิกที่รออนุมัติ (Admin)
- Owner/Admin เพิ่ม แก้ไข และปิดใช้งานสินค้า
- ผู้ใช้ที่เข้าสู่ระบบสั่งซื้อสินค้าได้ โดยระบบตรวจสอบและหักสต็อก พร้อมบันทึกราคาและชื่อสินค้า ณ เวลาสั่งซื้อ
- ผู้ซื้อและเจ้าของร้านดูรายการคำสั่งซื้อที่เกี่ยวข้องได้ ส่วน Admin ดูได้ทั้งหมด
- อัปโหลดภาพสินค้า JPG, PNG หรือ WEBP ขนาดไม่เกิน 5 MB

## เทคโนโลยี

- Node.js และ Express 5
- MongoDB และ Mongoose
- JWT และ bcrypt
- Multer สำหรับอัปโหลดไฟล์

## สิ่งที่ต้องเตรียม

- Node.js พร้อม npm
- MongoDB ในเครื่องหรือ MongoDB Atlas

## ติดตั้งและเริ่มใช้งาน

```bash
npm install
```

คัดลอก `.env.example` เป็น `.env` แล้วตั้งค่าตัวแปร:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/workshopexpress
JWT_SECRET=ใส่คีย์ลับที่สุ่มและคาดเดายาก
```

สำหรับ MongoDB Atlas ให้ใส่ connection string ของคลัสเตอร์ใน `MONGODB_URI` จากนั้นเริ่มเซิร์ฟเวอร์:

```bash
# โหมดพัฒนา
npm run dev

# โหมดปกติ
npm start
```

แอปเชื่อมต่อ MongoDB ก่อนเริ่มรับคำขอ ค่า `PORT` เริ่มต้นคือ `3000` และ API มี prefix `http://localhost:3000/api/v1`

## การยืนยันตัวตนและบทบาท

เมื่อเข้าสู่ระบบสำเร็จ ให้นำ token ไปใส่ใน header สำหรับ endpoint ที่ต้องยืนยันตัวตน:

```http
Authorization: Bearer <token>
```

บทบาทที่ระบบรองรับคือ `user`, `owner` และ `admin` ผู้สมัครใหม่จะมีสถานะ `pending` และ role `user` เมื่อ Admin อนุมัติ บัญชีจะเปลี่ยนสถานะเป็น `approved` และ role เป็น `owner`; หาก Admin ปฏิเสธ role จะยังเป็น `user` การเพิ่มสินค้าและจัดการสมาชิกต้องใช้ Admin หรือ Owner ตาม endpoint ส่วนบัญชี Admin ต้องเตรียมไว้ในฐานข้อมูลก่อน

## API Endpoints

ทุก endpoint ด้านล่างอยู่ใต้ prefix `/api/v1` เว้นแต่ระบุเป็นอย่างอื่น Endpoint ที่ต้องยืนยันตัวตนต้องส่ง Bearer token

### บัญชีผู้ใช้

| Method | Path | สิทธิ์ | รายละเอียด |
| --- | --- | --- | --- |
| `POST` | `/register` | สาธารณะ | สมัครสมาชิกด้วย `username` และ `password` (อย่างน้อย 8 ตัวอักษร) |
| `POST` | `/login` | สาธารณะ | เข้าสู่ระบบและรับ JWT |
| `GET` | `/test-auth` | เข้าสู่ระบบ | ทดสอบ token และดูข้อมูลผู้ใช้ปัจจุบัน |
| `GET` | `/users/pending` | Admin | ดูบัญชีที่รออนุมัติ |
| `PUT` | `/users/:id/approve` | Admin | อนุมัติบัญชีและเปลี่ยน role เป็น `owner` |
| `PUT` | `/users/:id/reject` | Admin | ปฏิเสธบัญชี |

ตัวอย่าง body สมัคร/เข้าสู่ระบบ:

```json
{
  "username": "sample-user",
  "password": "password123"
}
```

### สินค้า

| Method | Path | สิทธิ์ | รายละเอียด |
| --- | --- | --- | --- |
| `GET` | `/product` | เข้าสู่ระบบ | แสดงสินค้าที่ยังเปิดใช้งาน |
| `GET` | `/product/:id` | เข้าสู่ระบบ | ดูรายละเอียดสินค้าตาม ID |
| `POST` | `/product` | Owner/Admin | เพิ่มสินค้า |
| `PUT` | `/product/:id` | Owner/Admin | แก้ไขสินค้า (เจ้าของสินค้าหรือ Admin) |
| `DELETE` | `/product/:id` | Owner/Admin | ปิดใช้งานสินค้า (เจ้าของสินค้าหรือ Admin) |

การเพิ่มสินค้าใช้ `multipart/form-data` โดยส่ง `name`, `description` (ไม่บังคับ), `price`, `stock` และรูปใน field ชื่อ `image` (ไม่บังคับ) ราคาเป็นตัวเลขไม่ติดลบ และ stock เป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป การแก้ไขรับฟิลด์ `name`, `description`, `price`, `stock`; แม้ route จะรับไฟล์ `image` แต่ controller ปัจจุบันไม่ได้แปลงไฟล์ใหม่เป็นฟิลด์รูปในการอัปเดต

### คำสั่งซื้อ

| Method | Path | สิทธิ์ | รายละเอียด |
| --- | --- | --- | --- |
| `POST` | `/products/:id/orders` | เข้าสู่ระบบ | สั่งซื้อสินค้าตาม ID |
| `GET` | `/products/:id/orders` | เจ้าของสินค้า/Admin | ดูคำสั่งซื้อทั้งหมดของสินค้านั้น |
| `GET` | `/orders` | เข้าสู่ระบบ | ดูคำสั่งซื้อที่เกี่ยวข้องกับผู้ใช้; Admin ดูทั้งหมด |

ตัวอย่าง body สั่งซื้อ:

```json
{
  "quantity": 2
}
```

จำนวนต้องเป็นจำนวนเต็มบวก และต้องมีสต็อกเพียงพอ ผู้ใช้ไม่สามารถสั่งซื้อสินค้าของตัวเองได้ เมื่อสร้างคำสั่งซื้อสำเร็จ ระบบหักสต็อกและคำนวณราคารวมจากราคาสินค้าในฐานข้อมูล สถานะเริ่มต้นของคำสั่งซื้อคือ `pending`

## โครงสร้างโปรเจกต์

```text
src/
├── config/       # การเชื่อมต่อ MongoDB
├── controllers/  # รับคำขอและส่ง HTTP response
├── middlewares/  # Authentication, authorization และ upload
├── models/       # Mongoose models: User, Product, Order
├── routes/       # เส้นทาง API
├── services/     # กฎทางธุรกิจและการทำงานกับข้อมูล
├── app.js        # ตั้งค่า Express และผูก routes
└── server.js     # โหลด environment และเริ่มเซิร์ฟเวอร์
```

ไฟล์รูปสินค้าจัดเก็บใน `src/uploads/products/` ส่วนข้อมูลผู้ใช้ สินค้า และคำสั่งซื้อจัดเก็บใน MongoDB
