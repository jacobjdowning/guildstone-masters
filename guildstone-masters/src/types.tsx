export type Dungeon = 'De Other Side'|
'Halls of Atonement'|
'Mists of Tirna Scithe'|
'Plaguefall'|
'The Necrotic Wake'|
'Sanguine Depths'|
'Spires of Ascension'|
'Theater of Pain'

export type BaseAffix = 'fortified' | 'tyrannical'

export type AchievementNames = 'explorer'|'conqueror'|'master'

export type Runs = Record< BaseAffix, Record<Dungeon, number>>;

export interface Member {
    class: number,
    name: string,
    realm: string,
    'best-runs': Runs
    rating?: number
}

export interface Guild {
    name: string,
    realm: string,
    roster: Member[]
}

export interface DungeonKey {
    dungeon: Dungeon,
    level: number,
    baseAffix:BaseAffix
}