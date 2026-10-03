export const PRODUCTS = {
  "codeforgeme": {
    "accent": "#b293ed",
    "currency": "IDR",
    "tagline": "A workspace for things worth building.",
    "modules": [
      {
        "key": "projects",
        "label": "Proyek",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "description",
            "label": "Deskripsi",
            "type": "textarea"
          },
          {
            "key": "deadline",
            "label": "Target selesai",
            "type": "date"
          }
        ],
        "statuses": [
          "planning",
          "active",
          "review",
          "done"
        ]
      },
      {
        "key": "files",
        "label": "Berkas proyek",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "path",
            "label": "Path relatif",
            "type": "text",
            "required": true
          },
          {
            "key": "language",
            "label": "Bahasa",
            "type": "select",
            "options": [
              "javascript",
              "html",
              "css",
              "json",
              "markdown",
              "python",
              "text"
            ]
          },
          {
            "key": "content",
            "label": "Isi berkas",
            "type": "code",
            "required": true
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "tasks",
        "label": "Task board",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": false
          },
          {
            "key": "date",
            "label": "Tanggal",
            "type": "date",
            "required": true
          },
          {
            "key": "notes",
            "label": "Catatan",
            "type": "textarea"
          }
        ],
        "statuses": [
          "todo",
          "doing",
          "done"
        ]
      },
      {
        "key": "snippets",
        "label": "Snippet",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "language",
            "label": "Bahasa",
            "type": "text"
          },
          {
            "key": "content",
            "label": "Kode",
            "type": "code",
            "required": true
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "tests",
        "label": "Pengujian",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "content",
            "label": "JavaScript assertions",
            "type": "code",
            "required": true
          }
        ],
        "statuses": [
          "draft",
          "passed",
          "failed"
        ]
      },
      {
        "key": "releases",
        "label": "Catatan rilis",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "version_label",
            "label": "Versi",
            "type": "text",
            "required": true
          },
          {
            "key": "body",
            "label": "Changelog",
            "type": "textarea"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "environments",
        "label": "Environment checklist",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "key",
            "label": "Nama variabel",
            "type": "text",
            "required": true
          },
          {
            "key": "description",
            "label": "Deskripsi",
            "type": "textarea"
          },
          {
            "key": "required",
            "label": "Wajib",
            "type": "select",
            "options": [
              "yes",
              "no"
            ]
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "notes",
        "label": "Dokumentasi",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": false
          },
          {
            "key": "body",
            "label": "Isi",
            "type": "textarea"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "code-studio",
        "label": "Editor & preview",
        "tool": "code-studio",
        "fields": []
      },
      {
        "key": "dev-tools",
        "label": "Developer tools",
        "tool": "dev-tools",
        "fields": []
      },
      {
        "key": "assistant",
        "label": "Asisten kode",
        "tool": "ai",
        "fields": []
      },
      {
        "key": "reports",
        "label": "Laporan",
        "tool": "reports",
        "fields": [],
        "statuses": []
      }
    ],
    "id": "codeforgeme",
    "name": "CodeForge Workspace",
    "purpose": "Workspace pengembangan proyek dengan berkas, pengujian browser, paket ekspor dan alat diagnosis.",
    "sources": [
      "codeforgeme"
    ],
    "workflow": "Buat proyek → tambah/edit berkas → preview terisolasi → jalankan pengujian → perbaiki → ekspor paket proyek dan catatan rilis."
  }
};
