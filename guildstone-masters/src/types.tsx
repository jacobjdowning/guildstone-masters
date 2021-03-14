export interface Member {
    class: number,
    name: string,
    realm: string,
    progress:{
        'Mists of Tirna Scithe': number,
        'Sanguine Depths': number,
        'De Other Side': number,
        'The Necrotic Wake': number,
        'Theater of Pain': number,
        'Spires of Ascension': number,
        'Halls of Atonement': number,
        'Plaguefall': number
    },
    progressTotal?: number
}
export interface Guild {
    name: string,
    realm: string,
    roster: Member[]
}