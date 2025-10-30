FROM almalinux:9

RUN dnf -y install \
      https://download.oracle.com/otn_software/linux/instantclient/213000/oracle-instantclient-basic-21.3.0.0.0-1.el8.x86_64.rpm \
      python3.11 \
      python3.11-pip \
      python3.11-devel \
      gcc && \
    dnf clean all && \
    rm -rf /var/cache/yum && \
    pip3.11 install --upgrade pip

WORKDIR /app

COPY ./requirements.txt requirements.txt

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./src src

CMD ["fastapi", "run", "src/main.py", "--proxy-headers", "--host", "0.0.0.0", "--port", "8080"]


