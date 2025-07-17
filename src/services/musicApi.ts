const JAMENDO_CLIENT_ID = 'your_jamendo_client_id' // Se puede usar sin client_id para pruebas

export interface Track {
  id: string
  name: string
  artist_name: string
  album_name: string
  duration: number
  image: string
  audio: string
  audiodownload: string
}

export interface JamendoResponse {
  results: Track[]
}

class MusicApiService {
  private baseUrl = 'https://api.jamendo.com/v3.0'

  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo&groupby=artist_id`
      )
      const data: JamendoResponse = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error searching tracks:', error)
      return []
    }
  }

  async getPopularTracks(limit: number = 20): Promise<Track[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&order=popularity_total&include=musicinfo`
      )
      const data: JamendoResponse = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error fetching popular tracks:', error)
      return this.getFallbackTracks()
    }
  }

  async getTracksByGenre(genre: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&tags=${genre}&include=musicinfo`
      )
      const data: JamendoResponse = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error fetching tracks by genre:', error)
      return []
    }
  }

  async getNewReleases(limit: number = 20): Promise<Track[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&order=releasedate_desc&include=musicinfo`
      )
      const data: JamendoResponse = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error fetching new releases:', error)
      return []
    }
  }

  private getFallbackTracks(): Track[] {
    return [
      {
        id: '1',
        name: 'Chill Vibes',
        artist_name: 'Lo-Fi Artist',
        album_name: 'Relaxing Beats',
        duration: 180,
        image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
        audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      },
      {
        id: '2',
        name: 'Electronic Dreams',
        artist_name: 'Synth Master',
        album_name: 'Digital Waves',
        duration: 240,
        image: 'https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=300',
        audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      },
      {
        id: '3',
        name: 'Acoustic Journey',
        artist_name: 'Folk Singer',
        album_name: 'Unplugged Sessions',
        duration: 200,
        image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
        audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      }
    ]
  }

  // Convertir Track de Jamendo a nuestro formato Song
  convertToSong(track: Track) {
    return {
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      duration: track.duration,
      image_url: track.image || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      audio_url: track.audio || track.audiodownload,
      created_at: new Date().toISOString()
    }
  }
}

export const musicApi = new MusicApiService()