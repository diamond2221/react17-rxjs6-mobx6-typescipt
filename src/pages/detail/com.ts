import { from, fromEvent, Observable, of } from "rxjs";
import { take } from "rxjs/operators";

export const courseLists = [
    {
        "name": "My Courses",
        "courses": [{
            "id": 511019,
            "title": "React for Beginners",
            "covers": [{
                width: 150,
                height: 200,
                url: "http://placeimg.com/150/200/tech"
            }, {
                width: 200,
                height: 200,
                url: "http://placeimg.com/200/200/tech"
            }, {
                width: 300,
                height: 200,
                url: "http://placeimg.com/300/200/tech"
            }],
            "tags": [{
                id: 1,
                name: "JavaScript"
            }],
            "rating": 5
        }, {
            "id": 511020,
            "title": "Front-End automat workflow",
            "covers": [{
                width: 150,
                height: 200,
                url: "http://placeimg.com/150/200/arch"
            }, {
                width: 200,
                height: 200,
                url: "http://placeimg.com/200/200/arch"
            }, {
                width: 300,
                height: 200,
                url: "http://placeimg.com/300/200/arch"
            }],
            "tags": [{
                "id": 2,
                "name": "gulp"
            }, {
                "id": 3,
                "name": "webpack"
            }],
            "rating": 5
        }]
    },
    {
        "name": "New Release",
        "courses": [{
            "id": 511022,
            "title": "Vue2 for Beginners",
            "covers": [{
                width: 150,
                height: 200,
                url: "http://placeimg.com/150/200/nature"
            }, {
                width: 200,
                height: 200,
                url: "http://placeimg.com/200/200/nature"
            }, {
                width: 300,
                height: 200,
                url: "http://placeimg.com/300/200/nature"
            }],
            "tags": [{
                id: 1,
                name: "JavaScript"
            }],
            "rating": 5
        }, {
            "id": 511023,
            "title": "Angular2 for Beginners",
            "covers": [{
                width: 150,
                height: 200,
                url: "http://placeimg.com/150/200/people"
            }, {
                width: 200,
                height: 200,
                url: "http://placeimg.com/200/200/people"
            }, {
                width: 300,
                height: 200,
                url: "http://placeimg.com/300/200/people"
            }],
            "tags": [{
                id: 1,
                name: "JavaScript"
            }],
            "rating": 5
        }]
    }
];

(Array.prototype as any).concatAll = function () {
    const result: any = []
    this.forEach(v => {
        result.push.apply(result, v)
    })
    return result
}

const res = (courseLists.map(v => v.courses.map(v1 => {
    return {
        id: v1.id,
        title: v1.title,
        cover: v1.covers.filter(v2 => v2.width === 150 && v2.height === 200)[0]?.url
    }
})) as any).concatAll()


const observable$ = from(new Promise(resolve => {
    setTimeout(() => {
        resolve('RxJs Nb!')
    }, 1000);
}))
observable$.subscribe(
    (res) => {
        console.log(res)
    },
    () => {
        console.log('err')
    }
    ,
    () => {
        console.log('complate')
    }
)

document.querySelector<HTMLDivElement>('#id') && fromEvent(document.querySelector<HTMLDivElement>('#id')!, 'click')
    .pipe(take(2))
    .subscribe((res) => {
        console.log(res)
    })
