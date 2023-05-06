export interface GeoJsonRoot {
    type: string
    features: Feature[]
}

export interface Feature {
    type: string
    geometry: Geometry
    properties: Properties
}

export interface Geometry {
    type: string
    coordinates: any[]
}

export interface Properties {
    name: string
    address: string
    description: string
    timespan: Timespan
    Category: string
    Distance: string
}

export interface Timespan {
    begin: string
    end: string
}
