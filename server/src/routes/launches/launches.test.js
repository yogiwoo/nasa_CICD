const request=require('supertest');
const app=require("../../app");
const {mongoConnect,mongoDisconnect}=require('../../services/mongo')



describe('Launches API',()=>{

    beforeAll(async ()=>{
        await mongoConnect();
    })

    afterAll(async ()=>{
       await  mongoDisconnect()
    })
    describe('Test GET /launches',()=>{
        test('It should respond with 200 success', async ()=>{
            const response=await request(app)
                .get('/launches')
                .expect('Content-Type',/json/)
                .expect(200);
            expect(response.statusCode).toBe(200);
        });
    });
    
    describe('Test POST /launch',()=>{
        const completeLaunchData={
            mission:'USS Enterprises',
            rocket:'NCC 1701-D',
            target:'Kepler-62 f',
            launchDate:'January 4,2030'
        }
        const launchDataWithoutDate={
            mission:'USS Enterprises',
            rocket:'NCC 1701-D',
            target:'Kepler-62 f',
            launchDate:'January 4,2030'
        }
        const launchDataWithInvalidDate={
            mission:'USS Enterprises',
            rocket:'NCC 1701-D',
            target:'Kepler-62 f',
            launchDate:'January 4,2030'
        }
        test ('It should respond with 201 success',async ()=>{
            const response=await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type',/json/)
                .expect(201);
            
            const requestDate=new Date(completeLaunchData.launchDate).valueOf()
            const responseDate=new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        })
        test('It should catch missing requires properties',async ()=>{
            const response=await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type',/json/)
            .expect(400);
    
        expect(response.body).toStrictEqual({
            error:"Missing required launch property"
        })
            
    });
        test('It should catch invalid dates',async ()=>{
            const response=await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type',/json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error:"invalid launch date"
            })
        })
    })
})
