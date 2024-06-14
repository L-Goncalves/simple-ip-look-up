"use client";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";


const API_URL_BASE = 'http://ip-api.com/json/'

interface IPData {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
  port?: string;
}

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}
function validateIpFormat(ip: string) {
  // this is ugly, I know.
  var ipFormat =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  if (ip.match(ipFormat)) {
    return true;
  } else {
    return false;
  }
}

export default function Home() {
  const [ipInput, setIpInput] = useState<string>("");
  const [ip, setIp] = useState([]);
  const [ipData, setIpData] = useState<IPData | null>(null);
  const lookupIP = async () => {
    if (ipInput && validateIpFormat(ip[0])) {
      try {
        const response = await axios.get(`${API_URL_BASE}${ip[0]}`);
        setIpData({ ...response.data, port: ip[1] });
      } catch (error) {
        console.warn("Error fetching IP data:", error);
      }
    }
  };

  const debouncedLookupIP = debounce(lookupIP, 2000);
  useEffect(() => {
    debouncedLookupIP();
  }, [ipInput]);

  return (
    <>
      <main className="container_ip_data">
        <h1>SIMPLE IP LOOK UP</h1>
        <input
          type="text"
          value={ipInput}
          onChange={(e) => {
            const ipValidValue = e.target.value.replace(/[^0-9.:]/g, "");
            setIpInput(ipValidValue);
            setIp(ipValidValue.split(":") as SetStateAction<never[]>);
          }}
        />
        {ipData && ipData.status == "success" ? (
          <div>
            <h2>IP Data:</h2>

            {Object.keys(ipData).map((key: string) => {
              return (
                <div key={key}>
                  <p>
                    {key.substring(0, 1).toUpperCase() +
                      key.substring(1, key.length)}
                    :{ipData[key as keyof IPData]}
                  </p>
                </div>
              );
            })}
          </div>
        ): (<div>
               <br/><br/>
          Failed to find information about this IP Address, the range could be private.
        </div>)}
      </main>
      <footer>
      <br/><br/>
        The source code for this is available at:{" "}
        <div id="github">
          {" "}
        
          <a about="_blank" href="https://github.com/L-Goncalves/simple-ip-look-up">
          <img width="19" height="19" alt="GitHub Logomark" src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"/>
            github.com/L-Goncalves{" "}
          </a>
        </div>
        <br />
        <div>
        <br/><br/>
          <h2>Disclaimer:</h2>
          <p>
            This IP Lookup Project is provided "as is" and is intended for
            informational and educational purposes only. It allows users to look
            up Internet Protocol (IP) addresses at no cost. <br/><br/>The purpose of this
            project is to simply provide information about an IP address. It
            does not support, condone, or engage in any illegal activities.
            <br/><br/>
            Searching for an IP address is not illegal as it is public
            information used on the internet. <br/><br/>However, tracking IP addresses for
            the purposes of harassment, cyber crimes, or any other illegal
            activities is against the law.
            
            <br/><br/>
             The creator of this project makes no
            representations or warranties of any kind, express or implied, about
            the completeness, accuracy, reliability, suitability, or
            availability of the information provided.
            <br/><br/>
             Any reliance you place on
            such information is strictly at your own risk. The user agrees to
            use the information provided responsibly and acknowledges that the
            creator is not responsible for any damages, losses, or consequences
            that may result from the use of this project. 
            
            <br/><br/>
            Please be aware that
            misuse of IP address information can lead to criminal charges and/or
            civil penalties, including but not limited to those under laws that
            protect privacy and data security.
          </p>
        </div>
      </footer>
    </>
  );
}
